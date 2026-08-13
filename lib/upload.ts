import { api } from "@/lib/axios";

/**
 * Media upload client for Cloudflare R2.
 *
 * Images go through the API (`POST /upload/:folder`), which converts them to
 * WebP under 100KB before storing. Videos are too large for the serverless
 * body limit, so the API hands back a presigned PUT and the browser uploads
 * straight to R2.
 *
 * XHR rather than fetch throughout — it's the only way to read upload progress.
 */

export type UploadFolder =
  | "products"
  | "brands"
  | "categories"
  | "blog"
  | "hero"
  | "profile";

export interface UploadedMedia {
  url: string;
  /** R2 object key — persist it so the file can be deleted later. */
  key: string;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

/**
 * Raw upload ceiling, matching the API's own limit. The server compresses
 * every image to WebP under 100KB, so this only guards the request itself.
 */
export const MAX_UPLOAD_KB = 4 * 1024;

/** Videos skip the API and go straight to R2, so they aren't bound by it. */
export const MAX_VIDEO_UPLOAD_KB = 50 * 1024;

export const formatSize = (kb: number) =>
  kb >= 1024 ? `${kb / 1024}MB` : `${kb}KB`;

/** The API's error envelope puts the actionable text in `description`. */
const messageFromResponse = (responseText: string, fallback: string) => {
  try {
    const body = JSON.parse(responseText);
    return body?.description ?? body?.message ?? fallback;
  } catch {
    return fallback;
  }
};

const sendWithProgress = (
  xhr: XMLHttpRequest,
  body: File,
  onProgress: (pct: number) => void,
) => {
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      onProgress(Math.round((e.loaded / e.total) * 100));
    }
  };
  xhr.send(body);
};

/**
 * Upload an image. The server does the WebP conversion and compression, so any
 * common image format is acceptable here.
 */
export const uploadImage = (
  file: File,
  folder: UploadFolder,
  onProgress: (pct: number) => void,
) =>
  new Promise<UploadedMedia>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/upload/${folder}`);

    // Raw file as the body — the API parses it with express.raw().
    xhr.setRequestHeader("Content-Type", file.type);
    // Encoded so non-ASCII filenames can't break the header.
    xhr.setRequestHeader("X-File-Name", encodeURIComponent(file.name));

    const token =
      typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const { data } = JSON.parse(xhr.responseText);
          onProgress(100);
          resolve({ url: data.url, key: data.key });
          return;
        } catch {
          reject(new Error("Upload failed"));
          return;
        }
      }
      reject(new Error(messageFromResponse(xhr.responseText, "Upload failed")));
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    sendWithProgress(xhr, file, onProgress);
  });

/**
 * Upload a video straight to R2 with a presigned PUT, bypassing the API's
 * request-body limit. Requires PUT to be allowed in the bucket's CORS policy.
 */
export const uploadVideo = async (
  file: File,
  folder: UploadFolder,
  onProgress: (pct: number) => void,
): Promise<UploadedMedia> => {
  const { data } = await api.post<{
    data: { url: string; key: string; uploadUrl: string };
  }>("/upload/video/presign", {
    folder,
    filename: file.name,
    contentType: file.type,
  });

  const { url, key, uploadUrl } = data.data;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    sendWithProgress(xhr, file, onProgress);
  });

  return { url, key };
};

/** Remove an object that is no longer referenced by any record. */
export const deleteMedia = async (key: string) => {
  await api.delete("/upload", { data: { key } });
};
