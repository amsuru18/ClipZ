"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "../components/Notification";
import MyVideoCard from "../components/MyVideoCard";
import { Video, Upload, Loader2, Plus } from "lucide-react";

export default function MyVideos() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    fetchMyVideos();
  }, [session, status, router]);

  const fetchMyVideos = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyVideos();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching my videos:", error);
      showNotification("Failed to load your videos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await apiClient.deleteVideo(videoId);
      setVideos(videos.filter((video) => video._id?.toString() !== videoId));
      showNotification("Video deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting video:", error);
      showNotification("Failed to delete video", "error");
    }
  };

  const handleUpdateVideo = async (
    videoId: string,
    updatedData: Partial<IVideo>
  ) => {
    try {
      const updatedVideo = await apiClient.updateVideo(videoId, updatedData);
      setVideos(
        videos.map((video) => (video._id?.toString() === videoId ? updatedVideo : video))
      );
      showNotification("Video updated successfully", "success");
    } catch (error) {
      console.error("Error updating video:", error);
      showNotification("Failed to update video", "error");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
          <p className="text-neutral-400">Loading your videos...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">My Videos</h1>
          <p className="text-neutral-400">
            Manage and organize your video content
          </p>
        </div>
        <button
          onClick={() => router.push("/upload")}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload New Video
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="aspect-[9/16] bg-neutral-800 rounded-xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-neutral-800 rounded"></div>
                <div className="h-3 bg-neutral-800 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-xl"></div>
            <div className="relative w-full h-full bg-neutral-800 rounded-full flex items-center justify-center">
              <Video className="w-12 h-12 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">No videos yet</h2>
            <p className="text-neutral-400 max-w-md mx-auto">
              Start creating amazing content by uploading your first video and
              sharing it with the world!
            </p>
          </div>

          <button
            onClick={() => router.push("/upload")}
            className="btn btn-primary gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Your First Video
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Total Videos</p>
                  <p className="text-xl font-semibold text-white">
                    {videos.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 text-success-400">✓</div>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Published</p>
                  <p className="text-xl font-semibold text-white">
                    {videos.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 text-warning-400">👁</div>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Total Views</p>
                  <p className="text-xl font-semibold text-white">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div
                key={video._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MyVideoCard
                  video={video}
                  onDelete={handleDeleteVideo}
                  onUpdate={handleUpdateVideo}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
