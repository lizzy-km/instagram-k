interface IconProps {
  path: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export function Icon({ path, size = 1, className, onClick }: IconProps) {
  const px = size * 24;
  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      fill="currentColor"
      className={className}
      onClick={onClick}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
