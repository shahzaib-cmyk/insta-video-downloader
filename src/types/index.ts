export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImageUrl: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type Unit = "ms" | "s" | "m" | "h" | "d";
export type Duration = `${number} ${Unit}` | `${number}${Unit}`;

export type ResolvedURL = {
  type: "image" | "video";
  downloadtype: "url";
  filename: string;
  width: string;
  height: string;
  url: string;
};

export type ResolvedBlob = {
  type: "image" | "video";
  downloadtype: "blob";
  filename: string;
  width: string;
  height: string;
  blob: string;
};

export type ResolvedInfo = ResolvedURL | ResolvedBlob;

export type SuccessResponse<T> = {
  status: "success";
  message?: string;
  data: T;
};

export type ErrorResponse = {
  status: "error";
  message: string;
};

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : never;
