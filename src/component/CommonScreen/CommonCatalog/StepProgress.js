import React from "react";

const Modals = ({ step }) => {
  return (
    <div className="stepper-wrapper">
      <div
        className={`stepper-item ${
          step === 1 ? "active" : step > 1 ? "completed" : ""
        }`}
      >
        <div className="step-counter"></div>
        <div className="step-name">Prepare template</div>
      </div>
      <div
        className={`stepper-item ${
          step === 2 ? "active" : step > 2 ? "completed" : ""
        } `}
      >
        <div className="step-counter"></div>
        <div className="step-name">Map indentifiers</div>
      </div>
      <div className="stepper-item ">
        <div className="step-counter"></div>
        <div className="step-name">Download</div>
      </div>
    </div>
  );
};

export default Modals;
