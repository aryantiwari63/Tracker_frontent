import React from "react";

const EditMultipleButton = ({ name, onClick }) => {
  return (
    <>
      <button type="button" className="multibtn  " onClick={onClick}>
        {name}
      </button>
    </>
  );
};
export default EditMultipleButton;