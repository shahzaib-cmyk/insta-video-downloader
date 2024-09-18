import { NextResponse } from "next/server";

import { HTTPError } from "@/lib/errors";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";

import { ResolvedInfo } from "@/types";
import { getPictureInfo, getVideoInfo } from "@/features/instagram";
import { INSTAGRAM_CONFIGS } from "@/features/instagram/constants";
import { getPostInfoFromURL } from "@/features/instagram/utils";

function handleError(error: any) {
  if (error instanceof HTTPError) {
    const response = makeErrorResponse(error.message);
    return NextResponse.json(response, { status: error.status });
  } else {
    console.error(error);
    const response = makeErrorResponse();
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: Request) {
  console.log(`/api/video route hit`);
  if (!INSTAGRAM_CONFIGS.enableServerAPI) {
    const notImplementedResponse = makeErrorResponse("Not Implemented");
    return NextResponse.json(notImplementedResponse, { status: 501 });
  }

  const postUrl = new URL(request.url).searchParams.get("postUrl");
  if (!postUrl) {
    const badRequestResponse = makeErrorResponse("Post URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }
  console.log(`resolving post info`);
  const postInfo = getPostInfoFromURL(postUrl);
  if (!postInfo) {
    const noPostIdResponse = makeErrorResponse("Invalid Post URL");
    return NextResponse.json(noPostIdResponse, { status: 400 });
  }

  console.log(`getting info about media`);

  try {
    const postJson =
      postInfo.type === "reel"
        ? await getVideoInfo(postInfo.postId)
        : await getPictureInfo(postInfo.postId);
    // console.log({ postJson });
    console.log(`media info resolved`);

    const response = makeSuccessResponse<ResolvedInfo>(postJson);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return handleError(error);
  }
}
