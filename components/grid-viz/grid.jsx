"use client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import ImageBlock from "@/components/grid-viz/image-block";
import { saveImage } from "@/lib/db";

export default function Grid({ images, removeImage, setImages }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
