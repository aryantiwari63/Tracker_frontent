import ReactEcharts from "echarts-for-react";
import React from "react";
const gcolors = ["#3364FF", "#3380FF", "#33BBFF", "#33E0FF", "#33FFF9", "#33FFDD", "#33FFA8"];
class GraphLoading extends React.Component {
  
  render() {
    return (
      <ReactEcharts
        option={{
          graphic: {
            elements: [
              {
                type: "group",
                left: "center",
                top: "center",
                children: new Array(7).fill(0).map((val, i) => ({
                  type: "rect",
                  x: i * 20,
                  shape: {
                    x: 0,
                    y: -40,
                    width: 10,
                    height: 20,
                  },
                  style: {
                    fill: gcolors[i] ? gcolors[i] : "#5470c6",
                  },
                  keyframeAnimation: {
                    duration: 1000,
                    delay: i * 200,
                    loop: true,
                    keyframes: [
                      {
                        percent: 0.5,
                        scaleY: 0.3,
                        easing: "cubicIn",
                      },
                      {
                        percent: 1,
                        scaleY: 1,
                        easing: "cubicOut",
                      },
                    ],
                  },
                })),
              },
            ],
          },
        }}
        style={{ width: "100%", height: 300 }}
        lazyUpdate={true}
      ></ReactEcharts>
    );
  }
}

export default GraphLoading;
