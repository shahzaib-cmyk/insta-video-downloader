import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { apiClient } from "@/lib/api-client";

// Route handler for GET requests to serve images
export async function GET(request: NextRequest) {
  // const url = new URL(request.url).searchParams.get("url");
  const url =
    "https://instagram.fbhv1-1.fna.fbcdn.net/v/t51.29350-15/459923364_804287755010398_6526806640882785869_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fbhv1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=2pdx8MHJjr0Q7kNvgHQNk7q&_nc_gid=25439c6276424383986bc2bcd383a3b4&edm=AGenrX8BAAAA&ccb=7-5&ig_cache_key=MzQ1ODM5NjU0MjAyMjY3MDIwMA%3D%3D.3-ccb7-5&oh=00_AYD-I3Atf0xFdhGSCzli0l4yarHB81NcGY44-k5qjTLLZQ&oe=66F0B0E0&_nc_sid=ed990e";

  console.log({ url });
  if (url === undefined || url === null)
    return NextResponse.json({ error: "Image not found" }, { status: 404 });

  try {
    console.log("loading image");
    const res = await fetch(url);

    const blobData = await res.blob();
    const arrayBuffer = await blobData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("buffer");
    console.log(buffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error) {
    // If the image is not found or any error occurs, return a 404
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
