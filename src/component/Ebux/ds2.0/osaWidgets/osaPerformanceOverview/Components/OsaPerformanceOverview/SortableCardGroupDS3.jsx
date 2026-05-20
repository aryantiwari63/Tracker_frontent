import React, { useMemo, useState } from 'react';
import SortableCard from './SortableCardDs3';

const SortableCardGroupDS3 = ({ cards, setCards, metrics, activeCard = {}, handleSelectCard, setDrawerInfo, drawerInfo }) => {

  const visibleMatrix = useMemo(() => {
    return metrics?.filter(m => m.checked);
  }, [metrics])
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // --- Handlers ---


  // Drag start: Store the index of the vertical block
  const onDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // Drag over: Required to allow dropping
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Drop: Swap the positions in the array
  const onDrop = (e, dropIndex) => {
    e.preventDefault();
    const newBrands = [...cards];
    const itemToMove = newBrands.splice(draggedItemIndex, 1)[0];
    newBrands.splice(dropIndex, 0, itemToMove);
    setCards(newBrands);
    setDraggedItemIndex(null);
  };

  // --- Render Helpers ---

  const renderBrandGroup = (startIndex, endIndex) => {
    const group = cards.slice(startIndex, endIndex);

    return (
      <div className="flex  overflow-x-auto no-scrollbar">
        {/* Sidebar Labels */}
        <div className="flex flex-col gap-3 mr-3">
          <div className="w-[100px] h-[72px] flex items-center justify-center bg-[#FFFBEB] border border-gray-100 rounded-md">
            <span className="text-[16px] font-bold text-[#000000A6]">Entity</span>
          </div>
          {visibleMatrix?.map((m, idx) => {
            return (
              <div key={idx} className="w-[100px] h-[64px] flex items-center justify-center bg-[#FFFBEB] border border-gray-100 rounded-md">
                <span className="text-[16px] font-bold text-[#000000A6]">{m?.label}</span>
              </div>)
          })}
        </div>
        {/* {JSON.stringify(cards)} */}

        {/* Product Columns */}
        <div className="grid grid-cols-7 gap-3 w-full">
          {group.map((card, localIndex) => {
            return (
              <SortableCard key={card.id} globalIndex={(startIndex + localIndex)}
                card={card}
                draggedItemIndex={draggedItemIndex}
                visibleMatrix={visibleMatrix}
                activeCard={activeCard}
                handleSelectCard={handleSelectCard}
                setDrawerInfo={setDrawerInfo}
                drawerInfo={drawerInfo}
                onDrop={onDrop}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white px-4 font-sans select-none">
      {cards?.length > 0 ? renderBrandGroup(0, 7) : null}
      {cards?.length > 7 ?
        <>
          <div className="h-[1px] w-full bg-gray-200 my-4" />
          {renderBrandGroup(7, 14)}
        </>
        : null
      }

    </div>
  );
};

export default SortableCardGroupDS3;