// SellerCards.jsx
import React from "react";

export default function SellerCards({ cards = [], counterData = {} }) {
  // console.log('counterDatacounterData', counterData)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="w-[60px] h-[60px] flex items-center justify-center rounded-md border border-gray-200 bg-[#FAFAFA] shrink-0">
            <img src={card.icon} className="w-[26.93px] h-[24px]" alt="" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-inter font-medium text-[14px] leading-[100%] tracking-[0px]">{card.title}</div>
                <div className="bg-[#EBF7FF] px-[8px] opacity-60">
                  <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0]">{card.subtitle}</span>
                </div>
              </div>
            </div>

            <div className="mt-1">
              <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[0] pt-[12px]">{counterData?.[card?.value]??0}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
