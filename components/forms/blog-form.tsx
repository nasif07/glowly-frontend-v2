"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Controller,
  useForm,
  useFieldArray,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Newspaper,
  Sparkles,
  Search,
  FileText,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { blogSchema, type BlogInput } from "@/lib/schemas";
import { useBlog, useCreateBlog, useUpdateBlog } from "@/hooks/use-blogs";
import { getErrorMessage } from "@/lib/api-error";
import { slugify } from "@/lib/slugify";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { GlowButton } from "@/components/forms/glow-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const defaults: DefaultValues<BlogInput> = {
  title: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  tags: [""],
  author: "",
  isFeatured: false,
  isPublished: false,
};

const listInput =
  "flex-1 rounded-xl border border-[#E3CFDA] px-4 py-2 text-sm h-auto shadow-none focus-visible:ring-0";

export function BlogForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;

  const { data: blog, isLoading } = useBlog(id ?? "");
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog(id ?? "");

  const form = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: defaults,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const tags = useFieldArray({ control, name: "tags" as never });

  const watchedTitle = watch("title");
  const watchedImage = watch("featuredImage");
  const isPublished = watch("isPublished");

  useEffect(() => {
    if (isEdit && blog) {
      reset({
        ...defaults,
        ...blog,
        tags: blog.tags?.length ? blog.tags : [""],
        featuredImage: blog.featuredImage ?? "",
      } as BlogInput);
    }
  }, [isEdit, blog, reset]);

  useEffect(() => {
    if (watchedTitle && !isEdit) setValue("slug", slugify(watchedTitle));
  }, [watchedTitle, isEdit, setValue]);

  const onSubmit = (values: BlogInput) => {
    const payload: BlogInput = {
      ...values,
      tags: values.tags.filter((x) => x.trim()),
    };

    const onSuccess = () => {
      toast.success(isEdit ? "Blog post updated successfully!" : "Blog post created successfully!");
      router.push("/dashboard/blog");
    };
    const onError = (error: unknown) =>
      toast.error(
        getErrorMessage(error, isEdit ? "Error updating blog post" : "Error creating blog post"),
      );

    if (isEdit) updateBlog.mutate(payload, { onSuccess, onError });
    else createBlog.mutate(payload, { onSuccess, onError });
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-[#6B2D5C]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#300332]" />
        <span className="ml-3 font-medium tracking-wide">Loading post...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={isEdit ? "Edit Blog Post" : "New Blog Post"}
        Icon={Newspaper}
        onBack={() => router.back()}
      />

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6 pb-24">
          {/* SECTION 1: IDENTITY & SEO */}
          <div className="relative overflow-hidden rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#FBF4F7] opacity-50" />
            <div className="flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
              <Search className="h-4 w-4 text-[#C4891E]" /> Identity & SEO
            </div>

            <div className="relative z-10 mt-6 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C4891E]" /> Post Title
                </label>
                <Input
                  type="text"
                  {...register("title")}
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:border-[#6B2D5C] focus-visible:ring-0"
                />
                {errors.title && (
                  <span className="mt-1 text-xs text-red-500">{errors.title.message}</span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Meta Title
                </label>
                <Input
                  type="text"
                  {...register("metaTitle")}
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Slug
                </label>
                <Input
                  type="text"
                  {...register("slug")}
                  readOnly={!isEdit}
                  className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#F3EEEA] px-5 py-3 font-mono text-xs text-[#8A6F80] shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#300332]">
                  Meta Description
                </label>
                <Textarea
                  {...register("metaDescription")}
                  className="min-h-[80px] rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTENT */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-2 border-b border-[#F3E9DC] pb-4 text-xs font-bold tracking-widest text-[#300332] uppercase">
                  <FileText className="h-4 w-4 text-[#C4891E]" /> Content
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#300332]">
                      Excerpt
                    </label>
                    <Textarea
                      {...register("excerpt")}
                      placeholder="A short summary shown on the blog listing card..."
                      className="min-h-[80px] rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                    />
                    {errors.excerpt && (
                      <span className="mt-1 text-xs text-red-500">{errors.excerpt.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#300332]">
                      Body
                    </label>
                    <Controller
                      control={control}
                      name="content"
                      render={({ field }) => (
                        <RichTextEditor
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          minHeight="min-h-[320px]"
                          placeholder="Write the full post..."
                          imageFolder="blog"
                          error={errors.content?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#EFDFE7] bg-white p-8 shadow-sm">
                <ImageUploader
                  label="Featured Image"
                  required={false}
                  multiple={false}
                  folder="blog"
                  value={watchedImage}
                  onChange={(url, key) => {
                    setValue("featuredImage", url, { shouldValidate: true });
                    setValue("featuredImageKey", key);
                  }}
                  error={errors.featuredImage?.message}
                />
              </div>
            </div>

            {/* SECTION 3: METADATA & STATUS */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#EFDFE7] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-[#300332] uppercase">
                  <User className="h-3.5 w-3.5 text-[#C4891E]" /> Details
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#300332]">
                      Category
                    </label>
                    <Input
                      type="text"
                      {...register("category")}
                      placeholder="e.g. Skincare Tips"
                      className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#300332]">
                      Author
                    </label>
                    <Input
                      type="text"
                      {...register("author")}
                      placeholder="e.g. Dr. Amara Chen"
                      className="h-auto rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-5 py-3 shadow-none focus-visible:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-[#300332]">Tags</label>
                      <button
                        type="button"
                        onClick={() => tags.append("" as never)}
                        className="rounded-full bg-[#300332] p-1 text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    {tags.fields.map((f, i) => (
                      <div key={f.id} className="flex gap-2">
                        <Input
                          {...register(`tags.${i}`)}
                          className={`${listInput} py-2 text-xs`}
                          placeholder="Tag..."
                        />
                        <button type="button" onClick={() => tags.remove(i)}>
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-[#EFDFE7] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between rounded-2xl border border-[#EFDFE7] bg-[#FBF4F7] px-5 py-4">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-[#300332] uppercase">
                      Published
                    </p>
                    <p className="text-[10px] text-[#8A6F80]">
                      {isPublished ? "Live on the blog" : "Hidden from visitors"}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" {...register("isPublished")} />
                    <div className="peer h-6 w-10 rounded-full bg-[#E3CFDA] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#22C55E] peer-checked:after:translate-x-4" />
                  </label>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[#EFDFE7] bg-[#FBF4F7] px-5 py-4">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-[#300332] uppercase">
                      Featured
                    </p>
                    <p className="text-[10px] text-[#8A6F80]">Highlight on the blog homepage</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" {...register("isFeatured")} />
                    <div className="peer h-6 w-10 rounded-full bg-[#E3CFDA] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#300332] peer-checked:after:translate-x-4" />
                  </label>
                </div>
              </div>

              <GlowButton
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#300332] py-4 text-xs font-bold tracking-[2px] text-white uppercase shadow-lg shadow-[#300332]/20 transition-all hover:bg-[#321E1B] active:scale-[0.97]"
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Publishing..."
                  : isEdit
                    ? "Save Changes"
                    : "Save Post"}
              </GlowButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
