"use client";
import { useEffect } from "react";
import { useState } from "react";
import { getAllImages, saveImage, deleteImage } from "@/lib/db";
import Grid from "@/components/grid-viz/grid";
import ImageDropzone from "@/components/grid-viz/image-dropzone";
import Empty from "@/components/grid-viz/empty";
import HeaderActions from "@/components/grid-viz/header-actions";

export default function GridWrapper() {
  const [processing, setProcessing] = useState(true);
  const [images, setImages] = useState([]);

  const addImage = async (image) => {
    setImages((prev) => {
      const next = [{ ...image, position: prev.length }, ...prev];
      next.forEach((image) => saveImage(image));
      return next;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeImage = async (id) => {
    setImages((images) => images.filter((image) => image.id !== id));
    await deleteImage(id);
  };

  useEffect(() => {
    // Load all images from IndexedDB on mount
    getAllImages().then((storedImages) => {
      setImages(
        storedImages.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      );
      setProcessing(false);
    });
  }, []);

  return (
    <>
      <HeaderActions
        processing={processing}
        images={images}
        removeImage={removeImage}
      />
      {Boolean(!images.length) && <Empty />}
      <Grid images={images} setImages={setImages} removeImage={removeImage} />
      <ImageDropzone setProcessing={setProcessing} addImage={addImage} />
    </>
  );
}
