import React, { useState } from "react";
import "./styles.css";

// Tooltip component
const KeywordTooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && <div className="tooltip">{text}</div>}
    </div>
  );
};
export default KeywordTooltip;
