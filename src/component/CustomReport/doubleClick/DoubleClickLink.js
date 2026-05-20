import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

const DoubleClickLink = ({ path, children, content, from }) => {
  const history = useHistory();
  const handleDoubleClick = () => {
    content["edit"] = true;
    // console.log("content>>>>>>>>>>>>>>>>>>>", content);
    history.push(path, content);
  };

  return (
    <div
      className={
        from
          ? "max-w-[90%] whitespace-nowrap overflow-ellipsis overflow-hidden"
          : ""
      }
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: "pointer",
        // textUnderlineOffset: isHovered === content?.report_id && "0.3em",
        // textDecoration: isHovered === content?.report_id && "underline",
        // textDecorationThickness: isHovered === content?.report_id && "0.1em",
      }}
    >
      {children}
    </div>
  );
};

DoubleClickLink.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default DoubleClickLink;
