import React from "react";
import Card from "../Card";
import type { CardType } from "../types";

interface StockpileProps {
  sets: CardType[][];
  points: number;
  isSelf?: boolean;
  className?: string;
}

export default function Stockpile({ sets, points, isSelf = false, className = "" }: StockpileProps) {
  return (
    <div
      className={
        (isSelf
          ? "w-full sm:w-48 md:w-56 min-w-[180px] sm:min-w-[192px] md:min-w-[224px] flex flex-col bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-2xl p-2 sm:p-3 md:p-4 border border-yellow-300 shadow-2xl backdrop-blur-sm items-center "
          : "bg-gradient-to-br from-yellow-200/95 to-yellow-300/90 rounded-xl p-1.5 sm:p-2 border border-yellow-300/80 mb-2 w-full flex flex-col items-center shadow-xl backdrop-blur-sm ") +
        className
      }
    >
      <div className={isSelf ? "flex flex-col gap-2 sm:gap-3 w-full items-center" : "w-full flex flex-col items-center"}>
        {sets.length === 0 && isSelf && (
          <div className="text-yellow-900/80 text-xs sm:text-sm md:text-base text-center py-3 sm:py-4 md:py-6">No completed sets yet</div>
        )}
        {sets.map((set, i) => (
          <div key={i} className={isSelf ? "flex gap-0.5 sm:gap-1 justify-center w-full" : "flex gap-0.5 justify-center w-full mb-1"}>
            {set.map((card, j) => (
              <Card
                key={j}
                rank={card.rank as any}
                suit={card.suit as any}
                compact={true}
                style={isSelf ? { 
                  width: 24, 
                  height: 24, 
                  fontSize: 11 
                } : { 
                  width: 18, 
                  height: 18, 
                  fontSize: 9 
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={isSelf ? "mt-1.5 sm:mt-2 md:mt-3 flex flex-row items-center gap-1 sm:gap-2 text-yellow-900 font-bold text-xs sm:text-sm md:text-base" : "flex flex-row items-center gap-1 text-yellow-900 font-bold text-xs"}>
        <span>{points}</span>
        <span className={isSelf ? "text-yellow-900 font-semibold text-xs sm:text-sm" : "text-yellow-900 font-semibold text-[10px]"}>Points</span>
      </div>
    </div>
  );
} 