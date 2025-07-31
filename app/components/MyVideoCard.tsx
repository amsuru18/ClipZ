"use client";

import { useState } from "react";
import { IKVideo } from "imagekitio-next";
import { IVideo } from "@/models/Video";
import {
  Edit,
  Trash2,
  Save,
  X,
  Play,
  Eye,
  Calendar,
  Loader2,
} from "lucide-react";
import { useNotification } from "./Notification";

interface MyVideoCardProps {
  video: IVideo;
  onDelete: (videoId: string) => void;
  onUpdate: (videoId: string, data: Partial<IVideo>) => void;
}

export default function MyVideoCard({
  video,
  onDelete,
  onUpdate,
}: MyVideoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();
  const videoId = video._id?.toString();

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      showNotification("Title and description are required", "error");
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(videoId!, {
        title: title.trim(),
        description: description.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      showNotification("Failed to update video", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(videoId!);
    } catch (error) {
      setIsDeleting(false);
      showNotification("Failed to delete video", "error");
    }
  };

  const handleCancel = () => {
    setTitle(video.title);
    setDescription(video.description);
    setIsEditing(false);
  };

  return (
    <div className="group relative">
      <div className="card overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
        {/* Video Thumbnail */}
        <figure className="relative overflow-hidden">
          <div
            className="relative w-full overflow-hidden rounded-t-xl"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Overlay with Play Button */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Play
                  className="w-6 h-6 text-white ml-0.5"
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Video Stats */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
              <Eye className="w-3 h-3" />
              <span>0 views</span>
            </div>
          </div>
        </figure>

        {/* Video Info */}
        <div className="card-body p-4 space-y-3">
          {isEditing ? (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">Title</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered input-sm w-full"
                  placeholder="Enter video title"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">
                    Description
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered textarea-sm w-full resize-none"
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className={`btn btn-primary btn-sm flex-1 gap-2 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-ghost btn-sm gap-2"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="card-title text-lg font-semibold text-white line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Video Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3 h-3" />
                  <span>Just now</span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-xs text-success-400 font-medium">
                    Published
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-sm flex-1 gap-2 hover:bg-neutral-800/50"
                  disabled={isDeleting}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className={`btn btn-error btn-sm flex-1 gap-2 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-500/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
