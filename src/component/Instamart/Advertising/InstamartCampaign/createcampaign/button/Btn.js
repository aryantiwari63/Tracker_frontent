import React from "react";

const Btn = ({ title, onClick }) => {
  return (
    <>
      <button className="instamartcreatecampaignbtn" onClick={onClick}>
        {title}
      </button>
    </>
  );
};

export default Btn;
