interface BadgeProps {
  label: string;
  color?: string;
  variant?: "solid" | "outline";
  size?: "sm" | "md";
  onRemove?: () => void;
}

export default function Badge({
  label,
  color,
  variant = "solid",
  size = "sm",
  onRemove,
}: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  if (variant === "outline") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses}`}
        style={{ borderColor: color, color }}
      >
        {label}
        {onRemove && (
          <button onClick={onRemove} className="ml-0.5 hover:opacity-70">
            &times;
          </button>
        )}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium text-white ${sizeClasses}`}
      style={{ backgroundColor: color }}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70">
          &times;
        </button>
      )}
    </span>
  );
}
