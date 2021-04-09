import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";

import CaretDown from "../icons/caretDown.svg";
import SummaryPieChart from "../SummaryPieChart";
import {
  Assessment,
  Asset,
  fetchAssessments,
  useApiEndpoint,
} from "../store/api";
import {
  sortByActualFinish,
  keepOnlyLatestAssessment,
  extractReportData,
  formatTimestamp,
  getAssetByName,
  findAssetAssessments,
  assessmentsSummary,
  ReportData,
} from "../store/utils";

function Assessments({
  assets,
  assessments,
}: {
  assets: Asset[];
  assessments: Assessment[];
}) {
  const summary = assessmentsSummary(assessments);

  return (
    <div>
      <h1 className="text-5xl mb-8">Assessments</h1>
      {assessments.length ? (
        <div>
          <SummaryPieChart summary={summary} />

          <div className="">
            {keepOnlyLatestAssessment(assessments).map((a) => (
              <AssessmentItem key={a.id} assessment={a} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-red-800 px-10 py-2 m-2 rounded-md uppercase font-bold text-center">
          This asset does not currently have any assessments.
        </div>
      )}
    </div>
  );
}

const AssessmentItem = ({ assessment }: { assessment: Assessment }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const reportData = extractReportData(assessment.assessmentReport);

  const { pass, fail } = Object.values(reportData.hosts).reduce(
    (acc, val) => {
      if (val.passFail === "Pass") {
        acc.pass++;
      } else if (val.passFail === "Fail") {
        acc.fail++;
      }
      return acc;
    },
    { pass: 0, fail: 0 }
  );

  return (
    <div className="">
      <div
        className="cursor-pointer m-2 flex items-center"
        onClick={() => setShowModal(true)}
      >
        <div className="w-1/3 md:w-1/5 flex-shrink-0 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {assessment.title}
        </div>
        <div className="w-48 text-left pr-4">
          {assessment.actualFinish
            ? formatTimestamp(assessment.actualFinish)
            : "In Progress"}
        </div>
        <div className="flex-grow h-4 flex rounded-md overflow-hidden shadow-sm items-center">
          {pass ? (
            <div
              className="bg-green-400 h-4 text-xs text-white text-center font-bold"
              style={{ width: `${(pass / (pass + fail)) * 100}%` }}
            >
              {pass}
            </div>
          ) : null}
          {fail ? (
            <div
              className="bg-red-400 h-4 text-xs text-white text-center font-bold"
              style={{ width: `${(fail / (pass + fail)) * 100}%` }}
            >
              {fail}
            </div>
          ) : null}
          {!pass && !fail ? (
            <div className="bg-gray-900 w-full h-4"></div>
          ) : null}
        </div>
      </div>
      {showModal && (
        <DetailsModal
          onClose={() => setShowModal(false)}
          assessment={assessment}
          reportData={reportData}
        />
      )}
    </div>
  );
};

const numberButton = (text: string, number: number, colorClass: string) => (
  <div
    key={text}
    className={`text-lg px-2 sm:px-4 py-1 sm:py-2 text-black flex items-center ${colorClass}`}
  >
    <div className="font-bold flex-grow mr-8">{text}</div>
    <div className=" text-center font-bold">{number}</div>
  </div>
);

const DetailsModal = ({
  onClose,
  assessment,
  reportData,
}: {
  onClose: () => void;
  assessment: Assessment;
  reportData: ReportData;
}) => {
  document.body.classList.add("overflow-hidden");
  useEffect(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      <div
        className="z-40 fixed bg-black bg-opacity-20 inset-0"
        onClick={onClose}
      ></div>
      <div
        style={{ maxWidth: "700px" }}
        className="z-50 relative bg-gray-100 rounded-lg shadow-lg mt-20 mx-4 md:mx-auto"
      >
        <div className="p-4 text-black">
          <h2 className="text-xl font-bold mb-4">{assessment.title}</h2>
          {Object.entries(reportData.hosts).map(([hostName, values]) => (
            <div
              key={hostName}
              className="border border-gray-400 rounded-md mb-4 p-4"
            >
              <div className="text-xl font-bold mb-2 underline">{hostName}</div>
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
      </div>
    </div>
  );
};

export default Assessments;
