import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Video, Loader2 } from "lucide-react";

interface VideoFeedProps {
  videos: IVideo[];
  loading?: boolean;
}

export default function VideoFeed({ videos, loading = false }: VideoFeedProps) {
  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">
          Discover Amazing Videos
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Explore the latest videos from creators around the world
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div
            key={video._id?.toString()}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <VideoComponent video={video} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {videos.length === 0 && !loading && (
        <div className="text-center py-16 space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-xl"></div>
            <div className="relative w-full h-full bg-neutral-800 rounded-full flex items-center justify-center">
              <Video className="w-12 h-12 text-neutral-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              No videos found
            </h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              Be the first to upload a video and start sharing your content with
              the world!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
