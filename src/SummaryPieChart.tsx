import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

function SummaryPieChart({
  summary,
}: {
  summary: {
    pass: number;
    fail: number;
    incomplete: number;
  };
}) {
  const [pieChartHoverSegment, setPieChartHoverSegment] = useState<
    null | number
  >(null);

  const pieChartData = [
    { title: "Pass", value: summary.pass, color: "#24980F" },
    { title: "Fail", value: summary.fail, color: "#AB3117" },
    {
      title: "In Progress",
      value: summary.incomplete,
      color: "#000000",
    },
  ];

  return (
    <div className="bg-gray-200 rounded-md mb-8 p-4">
      <div className="mx-auto flex flex-col">
        <div className="text-black flex flex-wrap items-center justify-center">
          {pieChartData.map(({ title, value, color }) => (
            <div key={title} className="flex items-center justify-start mx-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: color }}
              ></div>
              {title}
            </div>
          ))}
        </div>
        <div className="h-96">
          <PieChart
            onMouseOver={(ev, segment) => setPieChartHoverSegment(segment)}
            onMouseOut={(ev, segment) => setPieChartHoverSegment(null)}
            segmentsShift={(segment) =>
              segment === pieChartHoverSegment ? 4 : 1
            }
            radius={40}
            animate={true}
            data={pieChartData.filter((v) => !!v.value)}
            label={({ dataEntry }) => dataEntry.value}
            labelStyle={{ fill: "white", fontSize: "7px" }}
            labelPosition={75}
            lineWidth={50}
          />
        </div>
      </div>
    </div>
  );
}

export default SummaryPieChart;
