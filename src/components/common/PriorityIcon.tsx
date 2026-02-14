interface PriorityIconProps {
  priority: "low" | "medium" | "high";
  className?: string;
}

const config = {
  low: { color: "text-success-500", label: "Low" },
  medium: { color: "text-warning-500", label: "Medium" },
  high: { color: "text-danger-500", label: "High" },
};

export default function PriorityIcon({ priority, className = "" }: PriorityIconProps) {
  const { color, label } = config[priority];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color} ${className}`}>
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
        {priority === "high" && (
          <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v12.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 111.1-1.02l1.95 2.1V2.75A.75.75 0 0110 2z" clipRule="evenodd" transform="rotate(180 10 10)" />
        )}
        {priority === "medium" && (
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        )}
        {priority === "low" && (
          <path fillRule="evenodd" d="M10 18a.75.75 0 01-.75-.75V4.66L7.3 6.76a.75.75 0 11-1.1-1.02l3.25-3.5a.75.75 0 011.1 0l3.25 3.5a.75.75 0 01-1.1 1.02L10.75 4.66v12.59A.75.75 0 0110 18z" clipRule="evenodd" transform="rotate(180 10 10)" />
        )}
      </svg>
      {label}
    </span>
  );
}
