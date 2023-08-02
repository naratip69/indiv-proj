import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function Chart({ chartData }) {
  return (
    <Line
      data={chartData}
      options={{
        scales: {
          y: {
            ticks: { precision: 0 },
          },
        },
      }}
    />
  );
}
