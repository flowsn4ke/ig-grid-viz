"use client";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BrushCleaning, Heart, Loader, Move, Trash } from "lucide-react";
import { useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { getAllImages, saveImage, deleteImage } from "@/lib/db";

export default function Home() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [processing, setProcessing] = useState(true);
  const [images, setImages] = useState([]);

  const addImage = async (image) => {
    setImages((images) => [...images, image]);
    await saveImage({ ...image, position: images.length });
  };

  const removeImage = async (id) => {
    setImages((images) => images.filter((image) => image.id !== id));
    await deleteImage(id);
  };

  const clearAll = async () => {
    for (const image of images) {
      await removeImage(image.id);
    }
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
    <div className="font-sans flex flex-col items-center gap-y-4 max-w-xl mx-auto">
      <header className="my-10 flex flex-col gap-y-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-65 from-[#C13584] via-[#E1306C] to-[#F56040]">
          Instagram Grid Visualization
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex gap-x-4">
            {/* <Button>
              <Heart />
              <span>Support</span>
            </Button> */}
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
      </header>
      <main>
        {Boolean(!images.length) && <Empty />}
        <Grid images={images} removeImage={removeImage} />
        <ImageDropzone setProcessing={setProcessing} addImage={addImage} />
      </main>
      <footer className="h-42 flex items-center justify-center">
        Made with&nbsp;
        <Heart className="fill-red-500 text-red-500" />
        &nbsp;@
        <a
          href="https://siquemlabs.com"
          className="underline underline-offset-4"
          target="_blank"
        >
          SiquemLabs
        </a>
      </footer>
    </div>
  );

  function Empty() {
    return (
      <div className="p-28 border border-dashed font-bold">
        Drag images anywhere over here !
      </div>
    );
  }

  function Grid({ images, removeImage }) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          strategy={rectSortingStrategy}
          items={images.map(({ id }) => id)}
        >
          <div className="grid grid-cols-3 gap-1">
            {images.map((image) => (
              <ImageBlock
                image={image}
                removeImage={removeImage}
                key={image.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    let orderedImages;

    setImages((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      orderedImages = arrayMove(items, oldIndex, newIndex);
      return orderedImages;
    });

    for (const [position, image] of orderedImages.entries()) {
      await saveImage({ ...image, position });
    }
  }
}

function ImageBlock({ image, removeImage }) {
  const { attributes, listeners, isOver, transform, transition, setNodeRef } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundImage: `url(${image.url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={`w-42 aspect-3/4 text-white font-bold select-none relative`}
    >
      <div className="flex justify-between gap-x-1">
        <Button {...listeners} size="icon-sm" variant="ghost">
          <Move />
        </Button>
        <Button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            removeImage(image.id);
          }}
          size="icon-sm"
          variant="ghost"
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}

export function ImageDropzone({ setProcessing, addImage }) {
  const onDrop = useCallback(
    async (files) => {
      setProcessing(true);

      for (const file of files) {
        const { url, width, height } = await processImageToWebP(file);
        addImage({ id: nanoid(), width, height, url });
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

async function processImageToWebP(file, maxEdge = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions if necessary
          if (width > maxEdge || height > maxEdge) {
            const scale = maxEdge / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          // Create a canvas with the new dimensions
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP
          const webpUrl = canvas.toDataURL("image/webp", quality);

          resolve({
            url: webpUrl,
            width,
            height,
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => reject(err);
      img.src = reader.result; // Load image from base64
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

async function processImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64Url = reader.result;
      const img = new Image();

      img.onload = () => {
        resolve({
          url: base64Url,
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = (err) => reject(err);
      img.src = base64Url; // load image from base64
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file); // convert file to base64
  });
}
