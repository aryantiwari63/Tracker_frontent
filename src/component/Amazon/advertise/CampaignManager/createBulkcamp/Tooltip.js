import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Tooltip = ({ title }) => {
  // const [selectedOption, setSelectedOption] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  // const [showHelp, setShowHelp] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };

  // const handleOptionChange = (e) => {
  //   setSelectedOption(e.target.value);
  // };
  return (
    <>
      <div
        className="tooltip-container "
        onMouseEnter={toggleTooltip}
        onMouseLeave={toggleTooltip}
      >
        <AiOutlineInfoCircle className="h-4  pt-1" />
        {showTooltip && (
          <span className="tooltip-text">
            {title
              ? title
              : "Ad groups are a way to organize and manage ads within a campaign"}
            <button className="tooltip-close" onClick={toggleTooltip}>
              X
            </button>
          </span>
        )}
      </div>
    </>
  );
};

export default Tooltip;
