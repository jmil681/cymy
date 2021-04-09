import { Assessment, Asset } from "./api";

export function keepOnlyLatestAssessment(
  assessments: Assessment[]
): Assessment[] {
  return sortByActualFinish(assessments).filter((value, index, arr) => {
    return arr.findIndex((a) => a.title === value.title) === index;
  });
}

export function assessmentsSummary(assessments: Assessment[]) {
  let summary = {
    pass: 0,
    fail: 0,
    incomplete: 0,
  };

  assessments.forEach((assessment) => {
    if (assessment.status === "In Progress") {
      summary.incomplete++;
    } else if (assessment.assessmentResult === "Pass") {
      summary.pass++;
    } else if (assessment.assessmentResult === "Fail") {
      summary.fail++;
    }
  });

  return summary;
}

export function getAssetByName(assets: Asset[], assetName: string) {
  return assets.find(
    (asset) => asset.name.toLowerCase() === assetName.toLowerCase()
  );
}

export function findAssetAssessments(
  assessments: Assessment[],
  asset: Asset
): Assessment[] {
  return assessments.filter(
    (a) => a.parentModule === "assets" && a.parentId === asset.id
  );
}

export function sortByActualFinish(assessments: Assessment[]): Assessment[] {
  return assessments.sort((a, b) =>
    a.actualFinish && b.actualFinish
      ? +new Date(b.actualFinish) - +new Date(a.actualFinish)
      : a.actualFinish
      ? 1
      : -1
  );
}

export type ReportData = {
  totalHosts: number;
  pass: number;
  fail: number;
  percentage: number;
  hosts: Hosts;
};

export type Hosts = {
  [key: string]: {
    expectedResult: string;
    actualSetting: string;
    passFail: string;
  };
};

const lineRegex = /([^:]+):(.*)/;
export function extractReportData(report: string): ReportData {
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
    totalHosts: parseInt(rawData.totalHosts) || 0,
    pass: parseInt(rawData.pass) || 0,
    fail: parseInt(rawData.fail) || 0,
    percentage: parseFloat(rawData.percentage) || 0,
    hosts: rawHosts as Hosts,
  };
}

function cleanReportDataKey(key: string) {
  let s = key.replace(/[^a-zA-Z]/g, "");
  return s[0].toLowerCase() + s.slice(1);
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    hour12: false,
  }).format(date);
}
