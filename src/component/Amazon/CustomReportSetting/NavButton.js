import React from "react";

const NavButton = ({ name, onClick, disabled, color, width }) => {
  return (
    <>
      <button
        type="button"
        className={
          disabled
            ? `customreportdisabled__btn ${width}`
            : `customreport__btn ${width}`
        }
        style={{
          background: disabled ? "black" : color,
          color: "#ffffff",
          paddingLeft: 15,
          paddingRight: 15,
          justifyContent: "center",
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {name}
      </button>
    </>
  );
};
export default NavButton;
