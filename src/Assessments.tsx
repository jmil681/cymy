import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import CaretDown from "./icons/caretDown.svg";
import { Assessment, fetchAssessments, TOKEN_EXPIRED_ERROR } from "./api";

function Assessments({
  token,
  onTokenExpired,
}: {
  token: string;
  onTokenExpired: () => void;
}) {
  const asyncAssessments = useAsync(fetchAssessments, [token]);

  useEffect(() => {
    if (
      asyncAssessments.error &&
      asyncAssessments.error.message === TOKEN_EXPIRED_ERROR
    ) {
      onTokenExpired();
    }
  }, [asyncAssessments.error]);

  return (
    <div>
      <h1 className="text-5xl mb-8">Assessments</h1>
      {asyncAssessments.loading && "Loading..."}
      {asyncAssessments.error && asyncAssessments.error.message}
      {asyncAssessments.result &&
        asyncAssessments.result.map((a) => (
          <AssessmentItem key={a.id} assessment={a} />
        ))}
    </div>
  );
}

const AssessmentItem = ({ assessment }: { assessment: Assessment }) => {
  const [showDetails, setShowDetails] = useState(false);

  const reportData = extractReportData(assessment.assessmentReport);

  return (
    <div className="mb-8">
      <h2 className="text-2xl mb-4">{assessment.title}</h2>
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
                <div className="font-bold text-xl">{hostName}</div>
                <table className="ml-4">
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

type ReportData = {
  totalHosts: number;
  pass: number;
  fail: number;
  percentage: number;
  hosts: Hosts;
};

type Hosts = {
  [key: string]: {
    expectedResult: string;
    actualSetting: string;
    passFail: string;
  };
};

const lineRegex = /([^:]+):(.*)/;
function extractReportData(report: string): ReportData {
  let data = {};

  let div = document.createElement("div");
  div.innerHTML = report;
  const lines = Array.prototype.slice
    .call(div.childNodes)
    .map((node) => node.innerText);

  let rawData: { [key: string]: string } = {};
  let rawHosts: { [key: string]: { [key: string]: {} } } = {};
  let currentHost = "";
  for (let line of lines) {
    if (line) {
      const match = line.match(lineRegex);
      if (match) {
        const property = match[1].trim();
        const value = match[2].trim();

        if (property === "Hostname") {
          currentHost = value;
          rawHosts[currentHost] = {};
        } else if (currentHost) {
          rawHosts[currentHost][cleanReportDataKey(property)] = value;
        } else {
          rawData[cleanReportDataKey(property)] = value;
        }
      }
    }
  }

  return {
    totalHosts: parseInt(rawData.totalHosts),
    pass: parseInt(rawData.pass),
    fail: parseInt(rawData.fail),
    percentage: parseFloat(rawData.percentage),
    hosts: rawHosts as Hosts,
  };
}

function cleanReportDataKey(key: string) {
  let s = key.replace(/[^a-zA-Z]/g, "");
  return s[0].toLowerCase() + s.slice(1);
}

export default Assessments;
