import { Card as CardType } from "../../game/logic";
import { useState } from "react";

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const cardColors: Record<string, string> = {
    vault: "bg-blue-100 border-blue-400",
    alarm: "bg-red-100 border-red-400",
    handcuff: "bg-yellow-100 border-yellow-400",
  };

  const cardEmoji: Record<string, string> = {
    vault: "🏦",
    alarm: "🚨",
    handcuff: "🔗",
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-24 h-32 p-2 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all ${cardColors[card.type]}`}
      >
        <div className="text-3xl">{cardEmoji[card.type]}</div>
        <div className="text-xs font-bold text-center mt-1 line-clamp-2">
          {card.name}
        </div>
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm z-50 whitespace-nowrap pointer-events-none">
          <div className="font-bold">{card.name}</div>
          <div className="text-xs">{card.description}</div>
          {card.value !== undefined && (
            <div className="text-xs text-yellow-300">Value: {card.value}</div>
          )}
          <div className="text-xs text-gray-400">ID: {card.type}</div>
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}
