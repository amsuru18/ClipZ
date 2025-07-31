"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Video, Upload, LogOut, Settings } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="navbar bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800/50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex-1">
            <Link
              href="/"
              className="btn btn-ghost text-xl gap-3 normal-case font-bold group"
              prefetch={true}
              onClick={() => showNotification("Welcome to ClipZ", "info")}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-primary-400 group-hover:text-primary-300 transition-colors duration-200" />
                <div className="absolute -inset-1 bg-primary-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <span className="text-gradient font-extrabold tracking-tight">
                ClipZ
              </span>
            </Link>
          </div>

          <div className="flex flex-1 justify-end">
            <div className="flex items-center gap-2">
              {session && (
                <>
                  <Link
                    href="/upload"
                    className="btn btn-primary btn-sm gap-2 hidden sm:flex"
                    onClick={() =>
                      showNotification("Upload your video to ClipZ", "info")
                    }
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Link>

                  <Link
                    href="/my-videos"
                    className="btn btn-ghost btn-sm gap-2 hidden md:flex"
                    onClick={() => showNotification("My Videos", "info")}
                  >
                    <Video className="w-4 h-4" />
                    My Videos
                  </Link>
                </>
              )}

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle btn-sm relative group"
                >
                  <User className="w-5 h-5 group-hover:text-primary-400 transition-colors duration-200" />
                  {session && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-neutral-900"></div>
                  )}
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] shadow-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-xl w-64 mt-4 py-3 animate-scale-in"
                >
                  {session ? (
                    <>
                      <li className="px-4 py-3 border-b border-neutral-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {session.user?.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {session.user?.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                      </li>

                      <li className="px-2 py-1">
                        <Link
                          href="/my-videos"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 group"
                          onClick={() => showNotification("My Videos", "info")}
                        >
                          <Video className="w-4 h-4 text-neutral-400 group-hover:text-primary-400 transition-colors duration-200" />
                          <span className="text-sm">My Videos</span>
                        </Link>
                      </li>

                      <li className="px-2 py-1">
                        <Link
                          href="/upload"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 group"
                          onClick={() =>
                            showNotification(
                              "Upload your video to ClipZ",
                              "info"
                            )
                          }
                        >
                          <Upload className="w-4 h-4 text-neutral-400 group-hover:text-primary-400 transition-colors duration-200" />
                          <span className="text-sm">Upload Video</span>
                        </Link>
                      </li>

                      <li className="px-2 py-1">
                        <button
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-error-500/10 text-error-400 hover:text-error-300 transition-all duration-200 w-full text-left group"
                          onClick={handleSignOut}
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="px-2 py-1">
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 group"
                        onClick={() =>
                          showNotification("Please sign in to continue", "info")
                        }
                      >
                        <User className="w-4 h-4 text-neutral-400 group-hover:text-primary-400 transition-colors duration-200" />
                        <span className="text-sm">Sign In</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
