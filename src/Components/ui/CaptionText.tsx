import { Link } from "react-router-dom";
import { Fragment } from "react";

const HASHTAG_SPLIT_PATTERN = /(#[a-zA-Z0-9_]+)/g;

interface CaptionTextProps {
  text: string;
  className?: string;
}

export function CaptionText({ text, className = "" }: CaptionTextProps) {
  const parts = text.split(HASHTAG_SPLIT_PATTERN);

  return (
    <p className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("#") && part.length > 1) {
          const tag = part.slice(1).toLowerCase();
          return (
            <Link
              key={i}
              to={`/tags/${tag}`}
              className="text-[var(--color-accent)] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </Link>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </p>
  );
}
