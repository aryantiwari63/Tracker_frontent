import React from "react";

const CreateAdGroupSteps = ({ onClose, content, tipcontent }) => {
  return (
    <>
      <div>
        <div className="row border-b justify-between ">
          <h1 className="font-bold py-4">Get Help </h1>
          <button onClick={onClose}>X</button>
        </div>
        {/* <div className="row text-blue-300 text-sm">Back to help</div> */}
        <div className="row">
          <label>Create an ad group</label>
          <p>{content}</p>
        </div>
        <div className="row border px-3 py-2 bg-gray-200">
          <span className="font-bold">Tip:</span>
          <span className="text-gray-600 ml-1">{tipcontent}</span>
        </div>
      </div>
    </>
  );
};

export default CreateAdGroupSteps;
