import React, { useState, useEffect } from "react";
import Chart from "./Chart";

export default function Stat() {
  const [label, setLabel] = useState(null);
  const [dataSets, setDataSets] = useState(null);
  const URL = "http://localhost:5000";
  const path = window.location.pathname;
  const pathArray = path.split("/");
  const [chartData, setChartData] = useState({
    labels: null,
    datasets: [
      {
        label: pathArray[2],
        data: null,
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${URL}${path}`);
      const data = await res.json();
      setLabel(Object.keys(data));
      setDataSets(Object.values(data));
    }
    fetchData();
  }, [path]);

  useEffect(() => {
    if (label) {
      setChartData((e) => {
        return { ...e, labels: label.filter((x) => x !== "total") };
      });
    }

    if (dataSets) {
      setChartData((e) => {
        return {
          ...e,
          datasets: [
            {
              label: pathArray[2],
              data: dataSets.slice(0, -1),
            },
          ],
        };
      });
    }
    console.log(chartData);
  }, [label, dataSets]);

  return (
    <div className="stat">
      <Chart chartData={chartData} />
      {label && dataSets && pathArray[2] !== "enroll" ? (
        <div>{dataSets[dataSets.length - 1]}</div>
      ) : null}
    </div>
  );
}
