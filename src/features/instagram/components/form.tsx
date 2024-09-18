/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { downloadFile, downloadFileToDisk } from "@/lib/utils";
import { getHttpErrorMessage } from "@/lib/http";

import { useVideoInfo } from "@/services/api/queries";
import Image from "next/image";

const formSchema = z.object({
  postUrl: z.string().url({
    message: "Provide a valid Instagram post link",
  }),
});

export function InstagramVideoForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postUrl: "",
    },
  });

  const { error, isPending, mutateAsync: getVideoInfo, data } = useVideoInfo();

  const httpError = getHttpErrorMessage(error);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { postUrl } = values;
    try {
      console.log("getting video info", postUrl);
      const info = await getVideoInfo({ postUrl });

      downloadFileToDisk(info);
      // downloadFile(videoUrl, { filename });
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="my-4 flex flex-col gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-2xl flex-col items-center rounded-lg border bg-accent/20 px-4 pb-16 pt-8 shadow-md sm:px-8"
        >
          <div className="mb-2 h-6 w-full px-2 text-start text-red-500">
            {httpError}
          </div>
          <div className="relative mb-6 flex w-full flex-col items-center gap-4 sm:flex-row">
            <FormField
              control={form.control}
              name="postUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="url"
                      placeholder="Paste your Instagram link here..."
                      className="h-12 w-full sm:pr-28"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="right-1 top-1 w-full sm:absolute sm:w-fit"
            >
              {isPending ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Download className="mr-2" />
              )}
              Download
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            If the download opens a new page, right click the video and then
            click Save as video.
          </p>
        </form>
      </Form>
      {data && (
        <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-lg border bg-accent/20 px-4 pb-12 pt-8 shadow-md sm:px-8">
          {data.type === "video" && data.downloadtype === "url" ? (
            <video src={data.url} />
          ) : data.downloadtype === "url" ? (
            <img src={data.url} alt="image" width={100} height={100} />
          ) : (
            <img
              // src={data.blob.arrayBuffer}
              alt="image"
              width={100}
              height={100}
            />
          )}
          <Button
            className="flex flex-1"
            onClick={() => downloadFileToDisk(data)}
          >
            Download
          </Button>
        </div>
      )}
    </div>
  );
}
