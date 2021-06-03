import { useContext, useEffect, useRef } from "react";
import { ValueContext } from "../BLE/BLEProvider";
import { Line } from "react-chartjs-2";
import { ChartData as IChartData } from "chart.js";
import { NavSubTitle } from "./NavText";

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

  const ref = useRef<IChartData>({
    labels: [new Date().toISOString().slice(17, 22)],
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
    if (valueState.battery?.batteryLevel) {
      let prev = ref.current;
      let data: any;

      if (prev.datasets?.[0].data) {
        data = prev.datasets?.[0].data;

        if (data.length > 100) {
          prev.labels?.shift();
          data.shift();
        }
        if (prev.labels)
          prev.labels = [
            ...prev.labels,
            new Date().toISOString().slice(17, 22),
          ];

        prev.datasets[0].data = [...data, valueState.battery?.batteryLevel];
        console.log("data", prev.datasets[0].data);
      }
    }
  }, [valueState.battery?.batteryLevel]);

  return (
    <>
      <NavSubTitle>
        <svg className="svg-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M16,15H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z"
          />
        </svg>
        Baterija
      </NavSubTitle>

      <div className="chart">
        <Line data={ref.current} options={options} />
      </div>
    </>
  );
};
