"use client";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move, Trash } from "lucide-react";

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
