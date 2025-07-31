import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Validate the ID format
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid video ID format" },
        { status: 400 }
      );
    }

    console.log("Fetching video with ID:", id);
    const video = await Video.findById(id).lean() as IVideo | null;

    if (!video) {
      console.log("Video not found with ID:", id);
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    console.log("Video found:", video.title);
    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    // Check if video exists and belongs to user
    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (existingVideo.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        controls: body.controls,
        transformation: body.transformation,
      },
      { new: true }
    );

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;

    // Check if video exists and belongs to user
    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (existingVideo.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete video
    await Video.findByIdAndDelete(id);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
