import React, { useState } from "react";
import DashboardGraph from "../../../flipkart/DashboadGraph";

const Graph=({
    graphFilters,
    setGraphFilters,
    graphData,
    state,
})=>{

    const [activeCards, setActiveCards] = useState([]);
    return(
        <>
        <div className="">
          <div className="flipkart__graphcard">
            <DashboardGraph
              activeCards={activeCards}
              setActiveCards={setActiveCards}
              graphFilters={graphFilters}
              setGraphFilters={setGraphFilters}
              graphData={graphData}
              state={state}
            />
          </div>
        </div>
        </>
    )
}

export default Graph