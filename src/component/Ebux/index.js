import React from "react";
import MainComponent from "./common-components/MainComponent";

const Ebux = ({ kpi }) => {
  return (
    <>
      <MainComponent mainKpi={kpi || "OSA"} />
    </>
  );
};

export default Ebux;
