import React, { useRef} from "react";
const RightPanelOptionSelected = ({
  selectedMetric = [],
  setSelectedMetric,
  platform,
}) => {
  const dropableRef = useRef();
  const dragItemRef = useRef();
  const dragOverItemRef = useRef();

  const handleDrag = (e, position) => {
    dragItemRef.current = position;
    let currentItem = e.target;
    currentItem.classList.add("dragging");
  }
  const handleDragEnd = (e, position) => {
    dragItemRef.current = position;
    let currentItem = e.target;
    currentItem.classList.remove("dragging");
  };
  const handleDragOver = (e, position) => {
    
    dragOverItemRef.current = position;
    const copyListItems = [...selectedMetric];
    const dragItemContent = copyListItems[dragItemRef.current];
    copyListItems.splice(dragItemRef.current, 1);
    copyListItems.splice(dragOverItemRef.current, 0, dragItemContent);
    dragItemRef.current = null;
    dragOverItemRef.current = null;
    setSelectedMetric(copyListItems);
  };
  // remove item from the list
  const removeData = (e) => {
    const { value } = e.target;
    const object = selectedMetric.filter((item) => item.key === value);
    setSelectedMetric((prev) => {
      return prev.filter((item) => item.key !== object[0].key);
    });
  };

  return (
    <>
      <div className="py-2 px-2 row h-full flex-col">
        <div className="customrightpanel__headings">
          Selected Metric{` (${selectedMetric.length})`}
        </div>
        <div
          className="h-full  flex-1 overflow-auto sortable_list"
          ref={dropableRef}
          
        >
          {selectedMetric?.map((item, i) => {
  return (
    <div
      key={item.key} 
      className="my-3 cursor-move px-2"
     
      id={item.key}
      draggable
      onDrag={(e) => {
        handleDrag(e, i);
      }}
      onDragEnter={(e) => {
        handleDragOver(e, i);
      }}
      onDragEnd={(e) => {
        handleDragEnd(e, i);
      }}
    >
      <div
          className={[
            "row  rightpanel__itembox ",
            platform === "blinkit" && "rightpanel__itembox--blinkit ",
          ].join(" ")}
        >
          <div className="col ">{item.label}</div>
          <button
            value={item.key}
            onClick={(e) => removeData(e)}
            className="rightpanel__itemboxbtn "
          >
            X
          </button>
        </div>
     
    </div>
  );
})}
        </div>
      </div>
    </>
  );
};

export default RightPanelOptionSelected;
