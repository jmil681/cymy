import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { PieChart } from "react-minimal-pie-chart";
import CaretDown from "./icons/caretDown.svg";
import { useParams } from "react-router-dom";
import {
  Assessment,
  Asset,
  fetchAssessments,
  useApiEndpoint,
} from "./store/api";
import {
  sortByActualFinish,
  extractReportData,
  formatTimestamp,
  getAssetByName,
  findAssetAssessments,
} from "./store/utils";

function Assessments({
  assets,
  assessments,
}: {
  assets: Asset[];
  assessments: Assessment[];
}) {
  const [pieChartHoverSegment, setPieChartHoverSegment] = useState<
    null | number
  >(null);
  const params = useParams<{ assetName: string }>();
  const asset = getAssetByName(assets, params.assetName);
  if (!asset) return <div>Not found</div>;
  const assetAssessments = findAssetAssessments(assessments, asset);

  let summary = {
    pass: 0,
    fail: 0,
    incomplete: 0,
  };

  assetAssessments.forEach((assessment) => {
    if (assessment.status === "In Progress") {
      summary.incomplete++;
    } else if (assessment.assessmentResult === "Pass") {
      summary.pass++;
    } else if (assessment.assessmentResult === "Fail") {
      summary.fail++;
    }
  });

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
    <div>
      <h1 className="text-5xl mb-8">{asset.name}</h1>
      {assetAssessments.length ? (
        <div>
          <div className="bg-gray-200 rounded-md mb-8 p-4">
            <div className="mx-auto flex flex-col">
              <div className="text-black flex flex-wrap items-center justify-center">
                {pieChartData.map(({ title, value, color }) => (
                  <div className="flex items-center justify-start mx-2">
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
                  onMouseOver={(ev, segment) =>
                    setPieChartHoverSegment(segment)
                  }
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

          {sortByActualFinish(assetAssessments).map((a) => (
            <AssessmentItem key={a.id} assessment={a} />
          ))}
        </div>
      ) : (
        <div>
          You think this shit is secure??? Without any assessments??? For shame!
          Security first!
        </div>
      )}
    </div>
  );
}

const AssessmentItem = ({ assessment }: { assessment: Assessment }) => {
  const [showDetails, setShowDetails] = useState(false);

  const reportData = extractReportData(assessment.assessmentReport);

  return (
    <div className="mb-8">
      <h2 className="text-2xl mb-4 flex flex-wrap">
        <div className="flex-grow">{assessment.title}</div>
        <div className="">
          {assessment.actualFinish
            ? formatTimestamp(assessment.actualFinish)
            : "In Progress"}
        </div>
      </h2>
      <div className="bg-gray-200 rounded-md">
        <div className="flex p-1 sm:p-2 ">
          {numberButton("Total", reportData.totalHosts, "")}
          {numberButton("Pass", reportData.pass, "bg-green-400 text-white")}
          {numberButton("Fail", reportData.fail, "bg-red-400 text-white")}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex p-2 sm:p-4 items-center justify-center flex-shrink rounded-md text-center text-black focus:outline-none"
          >
            <div>Details</div>
            <div
              className="h-4 w-4"
              style={{ transform: showDetails ? "rotate(180deg)" : "" }}
            >
              <CaretDown />
            </div>
          </button>
        </div>
        {showDetails && (
          <div className="p-4 text-black">
            {Object.entries(reportData.hosts).map(([hostName, values]) => (
              <div className="border border-gray-400 rounded-md mb-4 p-4">
                <table className="">
                  <tbody>
                    {Object.entries(values).map(([key, value]) => (
                      <tr key={key}>
                        <td className="pr-4 font-bold block sm:table-cell">
                          {key}
                        </td>
                        <td className="block sm:table-cell">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <div className="border border-gray-400 rounded-md p-4">
              <table>
                <tbody>
                  {Object.entries(assessment).map(([key, value]) =>
                    key === "assessmentReport" ? (
                      <tr key={key} className="hidden"></tr>
                    ) : (
                      <tr key={key}>
                        <td className="pr-4 block sm:table-cell font-bold">
                          {key}
                        </td>
                        <td className="block sm:table-cell">{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const numberButton = (text: string, number: number, colorClass: string) => (
  <div
    key={text}
    className={`text-lg mx-1 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-black flex items-center flex-grow ${colorClass}`}
  >
    <div className="font-bold flex-grow mr-2">{text}</div>
    <div className=" text-center font-bold">{number}</div>
  </div>
);

export default Assessments;
