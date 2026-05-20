import React from "react";
import GraphLoading from "./GraphLoading";
import "./catalogtable.css";

class FunnelGraph extends React.Component {
  render() {
    let currency_format = localStorage.getItem("currency_format");
    const { isConversionGraphLoaded, conversionGraphData } = this.props;
    // console.log("conversions::::::", conversionGraphData[0]);
    if (!isConversionGraphLoaded) return <GraphLoading />;
    return (
      //   <ReactEcharts
      //     option={{
      //       tooltip: {
      //         trigger: "item",
      //         formatter: "{a} <br/>{b} : {c}%",
      //       },
      //       color: ["#0081F7", "#39A0FF", "#8FCAFF", "#ffffff"],
      //       series: [
      //         {
      //           type: "funnel",
      //           height: "100%",
      //           sort: "descending",
      //           //   left: "10%",
      //           top: 30,
      //           //   bottom: 60,
      //           //   width: "80%",
      //           min: 0,
      //           max: conversionGraphData[1].value,
      //           minSize: "0%",
      //           maxSize: "100%",
      //           gap: 2,
      //           label: {
      //             show: true,
      //             position: "inside",
      //             color: "#fff",
      //           },
      //           labelLine: {
      //             length: 10,
      //             lineStyle: {
      //               width: 1,
      //               type: "solid",
      //             },
      //           },
      //           itemStyle: {
      //             borderColor: "#fff",
      //             borderWidth: 1,
      //           },
      //           emphasis: {
      //             label: {
      //               fontSize: 20,
      //             },
      //           },

      //           data: conversionGraphData,
      //         },
      //       ],
      //       z: 100,
      //     }}
      //     style={{ width: "100%" }}
      //     lazyUpdate={true}
      //   ></ReactEcharts>
      //   <div className="mx-[auto] py-[20px] h-[300px] w-[80%]">
      //     <div className="funnel funnelTop">
      //       <label className="labelFirst" title={`Impressions`}>
      //         Impressions
      //       </label>
      //     </div>
      //     <div className="funnel funnelMiddle">
      //       <label className="labelSecond" title={`Clicks`}>
      //         Clicks
      //       </label>
      //     </div>
      //     <div className="funnel funnelLast">
      //       <label className="labelThird" title={`Orders`}>
      //         Orders
      //       </label>
      //     </div>
      //   </div>

      <ul className="funnel">
        <li
          title={`Impressions - ${Number(
            conversionGraphData[0]["value"]
          ).toLocaleString(currency_format)}`}
        >
          <div

          // className="funnel-tooltip"
          // data-title={`Impressions - ${Number(
          //   conversionGraphData[0]["value"]
          // ).toLocaleString(currency_format)}`}
          >
            Impressions
          </div>
          <div>
            {Number(conversionGraphData[0]["value"]).toLocaleString(
              currency_format
            )}
          </div>
        </li>
        <li
          title={`Clicks Conversion - ${(
            (Number(conversionGraphData[1]["value"]) /
              Number(conversionGraphData[2]["value"])) *
            100
          ).toFixed(2)}`}
        >
          <div

          // className="funnel-tooltip"
          // data-title={`Impressions - ${Number(
          //   conversionGraphData[1]["value"]
          // ).toLocaleString(currency_format)}`}
          >
            Clicks
          </div>
          <div>
            {Number(conversionGraphData[1]["value"]).toLocaleString(
              currency_format
            )}
          </div>
        </li>

        <li
          title={`Orders Conversion - ${(
            (Number(conversionGraphData[2]["value"]) /
              Number(conversionGraphData[1]["value"])) *
            100
          ).toFixed(2)}`}
        >
          <div
          // className="funnel-tooltip"
          // data-title={`Orders - ${Number(
          //   conversionGraphData[2]["value"]
          // ).toLocaleString(currency_format)}`}
          >
            Orders
          </div>
          <div>
            {Number(conversionGraphData[2]["value"]).toLocaleString(
              currency_format
            )}
          </div>
        </li>
      </ul>
    );
  }
}

export default FunnelGraph;
