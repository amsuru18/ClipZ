"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import {
  Loader2,
  Upload,
  AlertCircle,
} from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress?: (progress: number) => void;
  onError?: () => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  onError,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onErrorHandler = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
    onError?.();
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-primary-500 bg-primary-500/10"
            : "border-neutral-700 hover:border-neutral-600 bg-neutral-900/50"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
      >
        <div className="space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-200 ${
                dragActive ? "bg-primary-500/20" : "bg-neutral-800"
              }`}
            ></div>
            <div className="relative w-full h-full rounded-full flex items-center justify-center">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-neutral-400" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {uploading ? "Uploading..." : "Upload your video"}
            </h3>
            <p className="text-sm text-neutral-400">
              {fileType === "video"
                ? "Drag and drop your video file here, or click to browse"
                : "Drag and drop your image file here, or click to browse"}
            </p>
            <p className="text-xs text-neutral-500">
              {fileType === "video"
                ? "Supports: MP4, MOV, AVI (Max 100MB)"
                : "Supports: JPEG, PNG, WebP (Max 5MB)"}
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          onError={onErrorHandler}
          onSuccess={handleSuccess}
          onUploadStart={handleStartUpload}
          onUploadProgress={handleProgress}
          accept={fileType === "video" ? "video/*" : "image/*"}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          validateFile={validateFile}
          useUniqueFileName={true}
          folder={fileType === "video" ? "/videos" : "/images"}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-error-50/10 border border-error-500/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-error-500">{error}</p>
            <p className="text-xs text-error-400 mt-1">
              Please try again with a valid file
            </p>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center gap-3 p-4 bg-primary-50/10 border border-primary-500/20 rounded-lg">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-primary-500">
              Uploading your file...
            </p>
            <p className="text-xs text-primary-400 mt-1">
              Please wait while we process your upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
