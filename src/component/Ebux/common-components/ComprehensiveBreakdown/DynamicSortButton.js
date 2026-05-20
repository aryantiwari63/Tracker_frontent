import React from 'react';

const SortingButton = ({ disabled, sortType, requestSort=() =>{} }) => {
  return (
    <div className="row flex-col w-5 px-1 gap-0.5 cursor-pointer" onClick={() => requestSort()}>
      <div className="h-[5px]">
        <img
          src="/assets/images/caretupIcon.svg"
          alt="Sort Ascending"
          className={!disabled && sortType === "ASC" ? "opacity-40" : "opacity-100"}
          style={{ height: '7px' }}
        />
      </div>
      <div className="h-[5px]">
        <img
          src="/assets/images/caretdownIcon.svg"
          alt="Sort Descending"
          className={!disabled && sortType === "DSC" ? "opacity-40" : "opacity-100"}
          style={{ height: '7px' }}
        />
      </div>
    </div>
  );
};

export default SortingButton;
