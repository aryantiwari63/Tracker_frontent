import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ analyticData = [], noOfIssue }) => {
  const hasData = analyticData?.length > 0;

  const data = {
 
    datasets: [
      {
        data: hasData ? analyticData.map(item => item.percentage) : [],
        backgroundColor: hasData ? analyticData.map(item => item.color) : [],
        hoverBackgroundColor: hasData ? analyticData.map(item => item.color) : [],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
          
            const percentage = analyticData[index]?.percentage || 0;
            const reviews = analyticData[index]?.count|| 0;

            return [
              ` No of Reviews: ${reviews}`,
              `Share Percentage: ${percentage}%`
            ];
          },
        },
        backgroundColor: '#0f172a', // dark background
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
      },
    },
  };

 
  return (
    <div className="relative w-80 h-80 mx-auto my-6">
      <Doughnut data={data} options={options} style={{ position: 'relative', zIndex: 25 }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-lg font-semibold">Total Reviews</p>
        <p className="text-2xl font-bold">{noOfIssue}</p>
      </div>
    </div>
  );
};

export default DonutChart;
