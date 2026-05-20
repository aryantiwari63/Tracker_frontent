import React from "react";

const Btn = ({ title, onClick }) => {
  return (
    <>
      <button className="blinkitcreatecampaignbtn" onClick={onClick}>
        {title}
      </button>
    </>
  );
};

export default Btn;
