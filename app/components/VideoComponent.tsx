import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Play, Eye, Clock } from "lucide-react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const videoId = video._id?.toString();

  return (
    <div className="group relative">
      <div className="card overflow-hidden bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
        {/* Video Thumbnail Container */}
        <figure className="relative overflow-hidden">
          <Link href={`/videos/${videoId}`} className="block relative">
            <div
              className="relative w-full overflow-hidden rounded-t-xl"
              style={{ aspectRatio: "9/16" }}
            >
              {/* Video Player */}
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
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Play
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Video Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>0:30</span>
              </div>
            </div>
          </Link>
        </figure>

        {/* Video Info */}
        <div className="card-body p-4 space-y-3">
          <Link
            href={`/videos/${videoId}`}
            className="group/title hover:opacity-80 transition-opacity duration-200"
          >
            <h3 className="card-title text-lg font-semibold text-white group-hover/title:text-primary-400 transition-colors duration-200 line-clamp-2">
              {video.title}
            </h3>
          </Link>

          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {video.description}
          </p>

          {/* Video Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Eye className="w-3 h-3" />
              <span>1.2k views</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-primary-400 font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-500/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
