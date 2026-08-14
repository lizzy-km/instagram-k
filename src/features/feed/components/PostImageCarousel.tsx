import { useState } from "react";
import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiChevronLeft, mdiChevronRight } from "@/Components/icons/paths";
import type { PostImage } from "@/lib/firestore/types";

interface PostImageCarouselProps {
  images: PostImage[];
}

export function PostImageCarousel({ images }: PostImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length <= 1) {
    return (
      <Image
        src={images[0]?.downloadURL}
        alt=""
        aspectRatio="1 / 1"
        containerClassName="w-full max-h-[500px]"
      />
    );
  }

  const current = images[index];

  return (
    <div className="relative w-full">
      <Image src={current?.downloadURL} alt="" aspectRatio="1 / 1" containerClassName="w-full max-h-[500px]" />

      {index > 0 && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => setIndex((i) => i - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-bg-overlay)] p-1 text-white"
        >
          <Icon path={mdiChevronLeft} size={1} />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          type="button"
          aria-label="Next image"
          onClick={() => setIndex((i) => i + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-bg-overlay)] p-1 text-white"
        >
          <Icon path={mdiChevronRight} size={1} />
        </button>
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((img, i) => (
          <span
            key={img.downloadURL}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
