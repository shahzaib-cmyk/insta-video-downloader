import { load } from "cheerio";

import {
  getPostPageHTML,
  getPostGraphqlData,
  getPostImage,
} from "@/services/instagram/requests";

import { ResolvedInfo } from "@/types";
import { HTTPError } from "@/lib/errors";

import { INSTAGRAM_CONFIGS } from "./constants";
import {
  formatGraphqlJson,
  formatPageJson,
  formatPictureJson,
  getPostInfoFromURL,
} from "./utils";

const getVideoJsonFromHTML = async (postId: string) => {
  const data = await getPostPageHTML({ postId });
  const postHtml = load(data);
  console.log({ postHtml });
  const videoElement = postHtml("meta[property='og:video']");
  console.log({ videoElement });

  if (videoElement.length === 0) {
    return null;
  }

  const videoInfo = formatPageJson(postHtml);
  console.log({ videoInfo });
  return videoInfo;
};

const getVideoJSONFromGraphQL = async (postId: string) => {
  const data = await getPostGraphqlData({ postId });

  const mediaData = data.data?.xdt_shortcode_media;

  if (!mediaData) {
    return null;
  }

  if (!mediaData.is_video) {
    throw new HTTPError("This post is not a video", 400);
  }

  const videoInfo = formatGraphqlJson(mediaData);
  return videoInfo;
};

export const getVideoInfo = async (postId: string) => {
  let videoInfo: ResolvedInfo | null = null;

  if (INSTAGRAM_CONFIGS.enableWebpage) {
    videoInfo = await getVideoJsonFromHTML(postId);
    if (videoInfo) return videoInfo;
  }

  if (INSTAGRAM_CONFIGS.enableGraphQL) {
    videoInfo = await getVideoJSONFromGraphQL(postId);
    if (videoInfo) return videoInfo;
  }

  throw new HTTPError("Video link for this post is not public.", 401);
};

const getPictureJsonFromHTML = async (postId: string) => {
  const data = await getPostImage({ postId });
  console.log({ data });
  // const postHtml = load(url);
  // console.log({ postHtml });
  // const pictureElement = postHtml("meta[property='og:image']");
  // console.log({ pictureElement });

  if (data === undefined || data === null) {
    return null;
  }

  const imageInfo = await formatPictureJson({ url: data.urL, blob: data.blob });
  console.log({ imageInfo });
  return imageInfo;
};

export const getPictureInfo = async (postId: string) => {
  let pictureInfo: ResolvedInfo | null = null;

  if (INSTAGRAM_CONFIGS.enableWebpage) {
    pictureInfo = await getPictureJsonFromHTML(postId);
    if (pictureInfo) return pictureInfo;
  }

  // if (INSTAGRAM_CONFIGS.enableGraphQL) {
  //   videoInfo = await getVideoJSONFromGraphQL(postId);
  //   if (videoInfo) return videoInfo;
  // }

  throw new HTTPError("Link for this post is not public.", 401);
};
