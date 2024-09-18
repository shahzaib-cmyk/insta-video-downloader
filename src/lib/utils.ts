import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { ResolvedInfo } from "@/types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getTimedFilename = (name: string, ext: string) => {
  const timeStamp = Math.floor(Date.now() / 1000).toString();
  return `${name}-${timeStamp}.${ext}`;
};

export function downloadFile(
  url: string,
  options: { filename?: string; target?: string }
) {
  const a = document.createElement("a");
  a.href = url;
  a.download = options.filename || "file";
  if (options.target) {
    a.target = options.target;
  }
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function downloadFileToDisk(data: ResolvedInfo) {
  const { downloadtype } = data;

  if (downloadtype === "blob") {
    // console.log(typeof data.blob);
    // console.log(data.blob);
    // // const blob = new Blob([await data.blob.text()], { type: data.blob.type });
    // const url = window.URL.createObjectURL(data.blob);
    // const a = document.createElement("a");
    // a.style.display = "none";
    // a.href = url;
    // a.download = data.filename ? data.filename : "noname.mp4"; // Specify file name
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url); // Clean up
    return;
  }
  await fetch(data.url)
    .then((response) => {
      console.log(response);
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = data.filename ? data.filename : "noname.mp4"; // Specify file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); // Clean up
    })
    .catch((err) => console.error("Failed to download: ", err));
}
