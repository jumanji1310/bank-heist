"use client";

// Props for the UserBadge component
interface UserBadgeProps {
  userId: string;
  color?: string;
}

// Component that displays a colored badge for a user
export default function UserBadge({ userId, color }: UserBadgeProps) {
  return (
    <p
      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white"
      style={{ backgroundColor: color || "#808080" }}
    >
      {userId}
    </p>
  );
}
