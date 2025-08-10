import React from "react";
import Card from "../Card";
import type { CardType } from "../types";

interface HandProps {
  myHand: CardType[];
}

export default function Hand({
  myHand,
}: HandProps) {
  return (
    <div className="flex gap-1 sm:gap-2 md:gap-3 flex-wrap justify-center px-2 sm:px-0">
      {myHand.map((card, idx) => (
        <div
          key={`${card.rank}-${card.suit}-${idx}`}
          className="hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform duration-200"
        >
          <Card rank={card.rank as any} suit={card.suit as any} />
        </div>
      ))}
    </div>
  );
} 