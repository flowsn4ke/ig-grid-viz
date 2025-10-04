"use client";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move, Trash2 } from "lucide-react";

export default function ImageBlock({ image, removeImage }) {
  const { attributes, listeners, transform, transition, setNodeRef } =
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
      className={`w-42 aspect-3/4 text-white font-bold select-none`}
    >
      <div className="flex justify-between gap-x-1 w-full h-full relative">
        <div {...listeners} className="w-full h-full hover:cursor-grab"></div>
        <Button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            removeImage(image.id);
          }}
          size="icon-sm"
          variant="ghost"
          className="hover:bg-opacity-90 absolute top-0 right-0"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
