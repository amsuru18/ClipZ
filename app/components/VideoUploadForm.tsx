"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import {
  Loader2,
  Upload,
  Video,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotification } from "./Notification";
import { apiClient, VideoFormData } from "@/lib/api-client";
import FileUpload from "./FileUpload";

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    setUploadStatus("success");
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setUploadStatus("uploading");
  };

  const handleUploadError = () => {
    setUploadStatus("error");
    showNotification("Upload failed. Please try again.", "error");
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully!", "success");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      setUploadStatus("idle");

      // Redirect to My Videos page
      router.push("/my-videos");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-xl"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gradient">Upload Your Video</h1>
        <p className="text-neutral-400 max-w-md mx-auto">
          Share your amazing content with the world. Upload your video and let
          others discover your creativity.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Video Title
            </span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${
              errors.title ? "input-error" : ""
            }`}
            placeholder="Enter an engaging title for your video..."
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
          />
          {errors.title && (
            <div className="flex items-center gap-2 text-error text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.title.message}</span>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </span>
          </label>
          <textarea
            className={`textarea textarea-bordered h-24 ${
              errors.description ? "textarea-error" : ""
            }`}
            placeholder="Describe your video content..."
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
          />
          {errors.description && (
            <div className="flex items-center gap-2 text-error text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.description.message}</span>
            </div>
          )}
        </div>

        {/* Video Upload Section */}
        <div className="form-control">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <Video className="w-4 h-4" />
              Upload Video
            </span>
          </label>

          <div className="space-y-4">
            <FileUpload
              fileType="video"
              onSuccess={handleUploadSuccess}
              onProgress={handleUploadProgress}
              onError={handleUploadError}
            />

            {/* Upload Progress */}
            {uploadStatus === "uploading" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Uploading video...</span>
                  <span className="text-primary-400 font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Success */}
            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 text-success-500 bg-success-50/10 border border-success-500/20 rounded-lg p-3">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Video uploaded successfully!
                </span>
              </div>
            )}

            {/* Upload Error */}
            {uploadStatus === "error" && (
              <div className="flex items-center gap-2 text-error-500 bg-error-50/10 border border-error-500/20 rounded-lg p-3">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Upload failed. Please try again.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn btn-primary btn-block gap-2 ${
            loading || uploadStatus !== "success"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={loading || uploadStatus !== "success"}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing Video...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Publish Video
            </>
          )}
        </button>
      </form>
    </div>
  );
}
