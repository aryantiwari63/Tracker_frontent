import React from "react";

const RuleAnalysisTableContent = () => {
  return (
    <>
      <table className="analysistable">
        <tbody>
            {/* active */}
          <tr className="analysistable__row">
            <td>
              <img
                src="http://13.234.176.50/amsfrontend/upload/avatar/active-circle.svg"
                alt=""
                className="pr-2"
              />
            </td>
            <td>
              <span className="row">
              <div className="text-sm"> Shankar Adwords</div> 
                <div className="">
                  <img
                    src="http://13.234.176.50/amsfrontend/upload/avatar/chevron-right.svg"
                    alt=""
                    className="pt-1"
                  />
                </div>
                </span>
                <div className="text-xs">
                  <a href="#" className="font-medium text-blue-600">
                    GC_Pmax_All Product
                  </a>
                </div>
            
            </td>

            <td></td>
            <td>
              <div className="PLA w-fit  ml-8">Reach</div>
            </td>
            <td className="analysistable__status ">
              <span className="analysistable__yellowstatus "></span>
            </td>
            <td className="analysistable__amount">
              -₹21,425.29
              <div className="analysistable__amtpercentage">-22.67 %</div>
            </td>
          </tr>

          <tr className="analysistable__row">
            <td>
              <img
                src="http://13.234.176.50/amsfrontend/upload/avatar/pause-circle.svg"
                alt=""
                className="pr-2"
              />
            </td>
            <td>
              <span className="row">
              <div className="text-sm">Shankar Adwords</div>  
                <div>
                  <img
                    src="http://13.234.176.50/amsfrontend/upload/avatar/chevron-right.svg"
                    alt=""
                    className="pt-1"
                  />
                </div>
                </span>
                <div className="text-xs">
                  <a href="#" className="font-medium text-blue-600">
                    GC_Pmax_All Product
                  </a>
                </div>
            
            </td>

            <td></td>
            <td>
              <div className="PCA w-fit  ml-8">Performance</div>
            </td>
            <td className="analysistable__status ">
              <span className="analysistable__greenstatus "></span>
            </td>
            <td className="analysistable__amount">
              -₹21,425.29
              <div className="analysistable__amtpercentage">-22.67 %</div>
            </td>
          </tr>

          {/* abort */}
          <tr className="analysistable__row">
            <td>
              <img
                src="http://13.234.176.50/amsfrontend/upload/avatar/aborted.svg"
                alt=""
                className="pr-2"
              />
            </td>
            <td>
              <span className="row">
             <div className="text-sm">  Shankar Adwords</div> 
                <div>
                  <img
                    src="http://13.234.176.50/amsfrontend/upload/avatar/chevron-right.svg"
                    alt=""
                    className="pt-1"
                  />
                </div>
                </span>
                <div className="text-xs">
                  <a href="#" className="font-medium text-blue-600">
                    GC_Pmax_All Product
                  </a>
                </div>
             
            </td>

            <td></td>
            <td>
              <div className="PLA w-fit  ml-8">Reach</div>
            </td>
            <td className="analysistable__status ">
              <span className="analysistable__yellowstatus "></span>
            </td>
            <td className="analysistable__amount">
              -₹21,425.29
              <div>-22.67 %</div>
            </td>
          </tr>

          {/* pause */}
          <tr className="analysistable__row">
            <td>
              <img
                src="http://13.234.176.50/amsfrontend/upload/avatar/pause-circle.svg"
                alt=""
                className="pr-2"
              />
            </td>
            <td>
              <span className="row">
                <div className="text-sm"> Shankar Adwords</div>
               
                <div>
                  <img
                    src="http://13.234.176.50/amsfrontend/upload/avatar/chevron-right.svg"
                    alt=""
                    className="pt-1"
                  />
                </div>
                </span>
                <div className="xs">
                  <a href="#" className="font-medium text-blue-600">
                    GC_Pmax_All Product
                  </a>
                </div>
             
            </td>

            <td></td>
            <td>
              <div className="PCA w-fit  ml-8">Performance</div>
            </td>
            <td className="analysistable__status ">
              <span className="analysistable__greenstatus "></span>
            </td>
            <td className="analysistable__amount">
              -₹21,425.29
              <div className="analysistable__amtpercentage">-22.67 %</div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default RuleAnalysisTableContent;
