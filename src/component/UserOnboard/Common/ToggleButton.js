import React from "react";
import "./ToggleButton.css"; // You'll add styles here

const ToggleButton = ({ status, is_verified, triggerHandler }) => {
  // console.log();

  return (
    <div
      className={`toggle-switch-new ${status ? "is-enabled" : ""}`}
      style={{ cursor: is_verified ? "pointer" : "not-allowed" }}
      onClick={() => {
        if (is_verified) {
          triggerHandler(status);
        }
      }}
    >
      <div className="toggle-knob"></div>
    </div>
  );
};

export default ToggleButton;
