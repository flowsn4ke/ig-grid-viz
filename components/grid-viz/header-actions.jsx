"use client";
import { Button } from "@/components/ui/button";
import { BrushCleaning, Loader } from "lucide-react";

export default function HeaderActions({ processing, images, removeImage }) {
  const clearAll = async () => {
    for (const image of images) {
      await removeImage(image.id);
    }
  };

  return (
    <div className="my-5 flex items-center justify-between">
      <div className="flex gap-x-4">
        <Button variant="outline" onClick={() => clearAll()}>
          <BrushCleaning />
          <span>Clear All</span>
        </Button>
      </div>
      {Boolean(processing) && (
        <span className="animate-spin">
          <Loader />
        </span>
      )}
      {Boolean(!processing) && <p className="">{images.length} images</p>}
    </div>
  );
}
