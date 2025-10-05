"use client";
import { useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { processImageToWebP } from "@/lib/process-images";

export default function ImageDropzone({ setProcessing, addImage }) {
  const onDrop = useCallback(
    async (files) => {
      setProcessing(true);

      for (const file of files) {
        const { url, width, height } = await processImageToWebP(file);
        await addImage({ id: nanoid(), width, height, url });
      }

      setProcessing(false);
    },
    [addImage]
  );

  useEffect(() => {
    const handleDrop = async (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onDrop(files);
    };

    const handleDragOver = (e) => e.preventDefault();

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onDrop]);

  return null; // nothing rendered, so React DnD & UI aren’t blocked
}
