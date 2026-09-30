"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Link2Off,
  ImagePlus,
  Loader2,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { isRichTextEmpty } from "@/lib/rich-text";
import { uploadImage, formatSize, MAX_UPLOAD_KB, type UploadFolder } from "@/lib/upload";
import { toast } from "sonner";

type ToolbarButton = {
  icon: React.ElementType;
  title: string;
  /** Runs the command. Split out so the toolbar stays declarative. */
  run: (editor: Editor) => void;
  /** Marks the button active — omitted for one-shot actions like the divider. */
  isActive?: (editor: Editor) => boolean;
  /** Renders a divider before this button. */
  separated?: boolean;
};

const BUTTONS: ToolbarButton[] = [
  {
    icon: Bold,
    title: "Bold",
    run: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive("bold"),
  },
  {
    icon: Italic,
    title: "Italic",
    run: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive("italic"),
  },
  {
    icon: Strikethrough,
    title: "Strikethrough",
    run: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive("strike"),
  },
  {
    icon: Heading2,
    title: "Heading",
    separated: true,
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive("heading", { level: 2 }),
  },
  {
    icon: Heading3,
    title: "Subheading",
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive("heading", { level: 3 }),
  },
  {
    icon: List,
    title: "Bullet list",
    separated: true,
    run: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive("bulletList"),
  },
  {
    icon: ListOrdered,
    title: "Numbered list",
    run: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive("orderedList"),
  },
  {
    icon: Quote,
    title: "Quote",
    separated: true,
    run: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive("blockquote"),
  },
  {
    icon: Code,
    title: "Inline code",
    run: (e) => e.chain().focus().toggleCode().run(),
    isActive: (e) => e.isActive("code"),
  },
  {
    icon: Minus,
    title: "Divider",
    run: (e) => e.chain().focus().setHorizontalRule().run(),
  },
];

function ToolbarIcon({
  icon: Icon,
  title,
  active,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  title: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      // Inside a <form>, an unqualified button submits it — every toolbar press
      // would save the post instead of formatting the selection.
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg p-1.5 text-[#6B2D5C] transition-colors hover:bg-[#F3E9DC] disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-[#300332] text-white hover:bg-[#300332]",
      )}
    >
      <Icon size={15} />
    </button>
  );
}

export interface RichTextEditorProps {
  /** Serialised HTML. Controlled by the form. */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Minimum height of the writing area, e.g. "min-h-[320px]". */
  minHeight?: string;
  error?: string;
  /**
   * R2 folder that inserted images upload into. Omit to hide the image button
   * — useful for short fields where an inline picture makes no sense.
   */
  imageFolder?: UploadFolder;
}

/**
 * TipTap editor shaped for react-hook-form: give it `value`/`onChange` from a
 * `<Controller>` and it behaves like any other controlled field.
 *
 * It emits HTML rather than TipTap's JSON so the stored value stays readable,
 * keeps working with the plain text and markup written before this editor
 * existed, and can be rendered by `<RichText>` without pulling TipTap onto the
 * public pages.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "min-h-[220px]",
  error,
  imageFolder,
}: RichTextEditorProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Only h2-h4 are offered: the page already owns its h1, and the
        // sanitiser drops anything outside that range anyway.
        heading: { levels: [2, 3, 4] },
        // Replaced by the configured Link below.
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      // Images sit between paragraphs as their own block, which is what makes
      // a body of text / picture / text read the way an article should.
      TiptapImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "rich-text-image" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    // Next renders this on the server first; without the flag React warns
    // about the hydration mismatch the editor's own DOM creates.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn("rich-text px-5 py-4 focus:outline-none", minHeight),
      },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      // TipTap serialises an empty document as "<p></p>". Hand the form an
      // empty string instead, so a `min(1)` rule still catches a blank body
      // rather than passing on markup with nothing inside it.
      onChange(isRichTextEmpty(html) ? "" : html);
    },
  });

  // Edit forms call `reset()` once the record loads, long after the editor
  // mounted. Push that back in only when it differs, or every keystroke would
  // round-trip through here and put the cursor back at the start.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming === editor.getHTML()) return;
    if (isRichTextEmpty(incoming) && isRichTextEmpty(editor.getHTML())) return;
    editor.commands.setContent(incoming, { emitUpdate: false });
  }, [editor, value]);

  const toggleLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", previous ?? "https://");
    if (href === null) return;

    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  /**
   * Push the chosen file through the same R2 pipeline the rest of the
   * dashboard uses, then drop the returned URL in at the cursor. Uploading
   * rather than embedding base64 keeps post bodies small — a handful of
   * inlined photos would otherwise bloat every row of the blogs collection.
   */
  const insertImage = useCallback(
    async (file: File) => {
      if (!editor || !imageFolder) return;

      const sizeKb = file.size / 1024;
      if (sizeKb > MAX_UPLOAD_KB) {
        toast.error(
          `That image is ${formatSize(sizeKb)} — the limit is ${formatSize(MAX_UPLOAD_KB)}.`,
        );
        return;
      }

      setUploading(true);
      try {
        const { url } = await uploadImage(file, imageFolder, () => {});
        editor
          .chain()
          .focus()
          // Alt text matters for search and screen readers, but blocking the
          // insert on a prompt would be worse; the filename is a sane start
          // and the author can refine it.
          .setImage({ src: url, alt: file.name.replace(/.[^.]+$/, "") })
          .run();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not upload that image",
        );
      } finally {
        setUploading(false);
      }
    },
    [editor, imageFolder],
  );

  if (!editor) {
    // Server render and first paint: a matching shell, so the field does not
    // collapse and shift the rest of the form when the editor takes over.
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7]",
          minHeight,
        )}
      />
    );
  }

  return (
    <div>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border bg-[#FBF4F7] transition-colors focus-within:border-[#6B2D5C]",
          error ? "border-red-400" : "border-[#E3CFDA]",
        )}
      >
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[#EFDFE7] bg-white/60 px-2 py-1.5">
          {BUTTONS.map(({ icon, title, run, isActive, separated }) => (
            <span key={title} className="flex items-center">
              {separated && (
                <span className="mx-1 h-5 w-px bg-[#EFDFE7]" aria-hidden />
              )}
              <ToolbarIcon
                icon={icon}
                title={title}
                active={isActive?.(editor)}
                onClick={() => run(editor)}
              />
            </span>
          ))}

          <span className="mx-1 h-5 w-px bg-[#EFDFE7]" aria-hidden />
          <ToolbarIcon
            icon={editor.isActive("link") ? Link2Off : Link2}
            title={editor.isActive("link") ? "Remove link" : "Add link"}
            active={editor.isActive("link")}
            onClick={toggleLink}
          />

          {imageFolder && (
            <>
              <span className="mx-1 h-5 w-px bg-[#EFDFE7]" aria-hidden />
              <ToolbarIcon
                icon={uploading ? Loader2 : ImagePlus}
                title={uploading ? "Uploading..." : "Insert image"}
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
              />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  // Reset first, so picking the same file twice still fires.
                  e.target.value = "";
                  if (file) void insertImage(file);
                }}
              />
            </>
          )}

          <span className="mx-1 h-5 w-px bg-[#EFDFE7]" aria-hidden />
          <ToolbarIcon
            icon={Undo2}
            title="Undo"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarIcon
            icon={Redo2}
            title="Redo"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>

        <EditorContent editor={editor} />
      </div>

      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  );
}
