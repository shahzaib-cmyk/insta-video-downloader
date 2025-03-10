import { apiClient } from "@/lib/api-client";

import { CustomError } from "@/lib/errors";

import { APIResponse, ResolvedInfo } from "@/types";

import { ServerEndpoints } from "./constants";

export async function getVideoInfo({
  postUrl,
}: {
  postUrl: string;
}): Promise<ResolvedInfo> {
  const searchParams = new URLSearchParams({ postUrl });
  const res = await apiClient.get(
    `${ServerEndpoints.GetByPostURL}?${searchParams.toString()}`
  );

  const json = (await res.json()) as APIResponse<ResolvedInfo>;

  if (json.status === "error") {
    throw new CustomError(json.message);
  }

  const data = json.data;

  return data;
}
