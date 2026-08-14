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
    return <Image src={images[0]?.downloadURL} alt="" aspectRatio="1 / 1" containerClassName="w-full" />;
  }

  const current = images[index];

  return (
    <div className="group relative w-full">
      <Image src={current?.downloadURL} alt="" aspectRatio="1 / 1" containerClassName="w-full" />

      {index > 0 && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => setIndex((i) => i - 1)}
          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100"
        >
          <Icon path={mdiChevronLeft} size={0.9} />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          type="button"
          aria-label="Next image"
          onClick={() => setIndex((i) => i + 1)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100"
        >
          <Icon path={mdiChevronRight} size={0.9} />
        </button>
      )}

      <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1">
        {images.map((img, i) => (
          <span
            key={img.downloadURL}
            className={`h-1.5 rounded-full transition-all duration-[var(--duration-fast)] ${
              i === index ? "w-3 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
