"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IKVideo } from "imagekitio-next";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "../../components/Notification";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function VideoDetailPage() {
  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { showNotification } = useNotification();
  const videoId = params.id as string;

  useEffect(() => {
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getVideo(videoId);
      setVideo(data);
    } catch (error) {
      console.error("Error fetching video:", error);
      setError("Failed to load video");
      showNotification("Failed to load video", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📹</div>
          <h2 className="text-2xl font-semibold mb-2">Video not found</h2>
          <p className="text-base-content/70 mb-6">
            The video you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="btn btn-ghost mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Videos
        </Link>

        {/* Video Player */}
        <div className="mb-8">
          <div
            className="rounded-xl overflow-hidden relative w-full bg-black"
            style={{ aspectRatio: "9/16", maxWidth: "400px", margin: "0 auto" }}
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
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
            <p className="text-base-content/70 text-lg leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Video Metadata */}
          <div className="flex items-center gap-6 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(
                  video.createdAt?.toString() || new Date().toISOString()
                )}
              </span>
            </div>
            {video.userId && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>User ID: {video.userId.toString()}</span>
              </div>
            )}
          </div>

          {/* Video Settings */}
          {video.transformation && (
            <div className="bg-base-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Video Settings</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-base-content/60">Resolution:</span>
                  <div className="font-medium">
                    {video.transformation.width} × {video.transformation.height}
                  </div>
                </div>
                {video.transformation.quality && (
                  <div>
                    <span className="text-base-content/60">Quality:</span>
                    <div className="font-medium">
                      {video.transformation.quality}%
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-base-content/60">Controls:</span>
                  <div className="font-medium">
                    {video.controls ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
