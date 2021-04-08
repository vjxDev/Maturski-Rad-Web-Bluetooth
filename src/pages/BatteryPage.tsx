import { useContext, useEffect, useState } from "react";
import { ValueContext } from "../BLE/BLEProvider";
import { Line, ChartData } from "react-chartjs-2";
import { ChartData as IChartData } from "chart.js";
import { useStatus } from "../BLE/hooks";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export const BatteryPage = () => {
  const { valueState } = useContext(ValueContext);
  const [data, setData] = useState<ChartData<IChartData>>({
    labels: ["1", "2", "3", "4", "5", "6"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  });
  const [label, setLabel] = useState<string[]>([]);
  const [dataSet, setDataSet] = useState<number[]>([]);

  useEffect(() => {}, [valueState.battery?.batteryLevel]);
  return (
    <>
      <h1>Battery</h1>
      <span>{valueState.battery?.batteryLevel}</span>
      <Line data={data} options={options} />
    </>
  );
};
