import { useContext, useEffect, useState } from "react";
import { ValueContext } from "../BLE/BLEProvider";
import { Line, ChartData } from "react-chartjs-2";
import { ChartData as IChartData } from "chart.js";

export const NavBattery = () => {
  const options: Chart.ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],

      yAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
            beginAtZero: true,
          },
          gridLines: {
            borderDash: [10, 5],
          },
        },
      ],
    },
  };
  const { valueState } = useContext(ValueContext);
  const [chartData, setChartData] = useState<ChartData<IChartData>>({
    labels: ["start"],
    datasets: [
      {
        label: "% Battery",
        data: [0],
        fill: false,
        backgroundColor: "hsl(189, 60%, 70%)",
        borderColor: "hsla(182, 100%, 56%, 0.2)",
      },
    ],
  });

  useEffect(() => {
    setChartData((prev: any) => {
      let d: any;
      if (prev.datasets?.[0].data) {
        d = prev.datasets?.[0].data;
        if (d.length > 150) {
          prev.labels.shift();
          d.shift();
        }
        prev.labels = [...prev.labels, new Date().toISOString().slice(17, 22)];
        d = [...d, valueState.battery?.batteryLevel];
        prev.datasets[0].data = d;
        prev = { ...prev };
      }

      return prev;
    });
  }, [valueState.battery?.batteryLevel]);
  return (
    <div className="">
      <svg className="h-6 w-6 mx-auto" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M9,2V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4H15V2H9M11.83,8H12.33L15.18,10.85L13.04,13L15.17,15.14L12.33,18H11.83V14.21L9.54,16.5L8.83,15.79L11.62,13L8.83,10.21L9.54,9.5L11.83,11.79V8M12.83,9.91V11.79L13.77,10.85L12.83,9.91M12.83,14.21V16.08L13.77,15.14L12.83,14.21Z"
        />
      </svg>
      <span>Battery</span>
      <div className="chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
