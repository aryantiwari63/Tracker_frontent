import React from "react";

const TargetBtn = ({ title, btn, onClick, disabled }) => {
  return (
    <>
      <button
        className={[
          "targetdraftbtn",
          btn === "create" && "targetdraftbtn--create",
        ].join(" ")}
        onClick={onClick}
        disabled={disabled}
      >
        {title}
      </button>
    </>
  );
};
export default TargetBtn;
