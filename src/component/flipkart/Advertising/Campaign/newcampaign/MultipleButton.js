import React from "react";

const MultipleButton = ({ name, onClick }) => {
  return (
    <>
      <button type="button" className="multibtn  " onClick={onClick}>
        {name}
      </button>
    </>
  );
};
export default MultipleButton;
