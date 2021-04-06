export const TOKEN_EXPIRED_ERROR = "Token expired";
const ASSESSMENTS_ENDPOINT = "/api/atlasity/assessments/getAll";
const AUTH_ENDPOINT = "/api/atlasity/authentication/login";

type AuthResponse = {
  id: string;
  auth_token: string;
  expires_in: number;
};

export const auth = async (user: string, pass: string): Promise<AuthResponse> =>
  await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": "*/*",
      //Authorization: `Basic ${btoa(user + ":" + pass)}`,
      "Content-Type": "application/json",

    },
    mode: "cors",
    cache: "default",
    body: JSON.stringify({ username: user, password: pass }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 400) {
      throw new Error("Invalid username or password");
    } else if (response.status === 404) {
      if (user === "test") {
        return mockAuthResponse;
      } else {
        throw new Error("Invalid username or password");
      }
    } else {
      throw new Error(response.statusText);
    }
  });

const mockAuthResponse = {
  id: "559f2aec-e49e-4a63-a498-26569325e24d",
  auth_token: "token string",
  expires_in: 7200,
};

export type Assessment = {
  id: number;
  uuid: string;
  leadAssessor: string;
  leadAssessorId: string;
  title: string;
  assessmentType: string;
  assessmentResult: string;
  plannedStart: string;
  plannedFinish: string;
  status: string;
  actualFinish: string;
  assessmentReport: string;
  parentId: number;
  parentModule: string;
  createdBy: string;
  createdById: string;
  dateCreated: string;
  lastUpdatedBy: string;
  lastUpdatedById: string;
  dateLastUpdated: string;
};

export const fetchAssessments = async (token: string): Promise<Assessment[]> =>
  await fetch(ASSESSMENTS_ENDPOINT, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    mode: "cors",
    cache: "default",
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 401) {
      throw new Error(TOKEN_EXPIRED_ERROR);
    } else if (response.status === 404) {
      return mockData;
    } else {
      throw new Error(response.statusText);
    }
  });

const mockData: Assessment[] = [
  {
    id: 10,
    uuid: "28e810c0-c3f5-452a-b5a9-49c8fc233c3a",
    leadAssessor: "service, api",
    leadAssessorId: "5e9daef6-788a-4414-a520-d7f2ea6659b9",
    title: "1109 Assessment Test - 2021-03-25T17:27:46Z",
    assessmentType: "Script/DevOps Check",
    assessmentResult: "Fail",
    plannedStart: "2021-03-25T17:27:46",
    plannedFinish: "2021-03-25T17:27:46",
    status: "Complete",
    actualFinish: "2021-03-25T17:27:46",
    assessmentReport:
      "<div>Total Hosts: 2</div><div>Pass: 0</div><div>Fail: 2</div><div>Percentage: 0.0</div><div>---------</div><div><b>Hostname: admin-ipa02</b></div><div>Expected Result: MaxSessions present and not commented out</div><div>Actual Setting: #MaxSessions 10</div><div>Pass/Fail: Fail</div><div>---------</div>\n<div><b>Hostname: risk01</b></div><div>Expected Result: MaxSessions present and not commented out</div><div>Actual Setting: #MaxSessions 10</div><div>Pass/Fail: Fail</div><div>---------</div>",
    parentId: 1109,
    parentModule: "controls",
    createdBy: "service, api",
    createdById: "5e9daef6-788a-4414-a520-d7f2ea6659b9",
    dateCreated: "2021-03-25T17:28:02.0420578",
    lastUpdatedBy: "service, api",
    lastUpdatedById: "5e9daef6-788a-4414-a520-d7f2ea6659b9",
    dateLastUpdated: "2021-03-25T17:28:02.0420589",
  },
  {
    id: 11,
    uuid: "28e814c0-c3f5-452a-b5a9-49c8fc233c3a",
    leadAssessor: "service, api",
    leadAssessorId: "5e9daef6-788a-4414-a520-d7f2ea6659b9",
    title: "1109 Assessment Test 2 - 2021-03-25T17:27:46Z",
    assessmentType: "Script/DevOps Check",
    assessmentResult: "Fail",
    plannedStart: "2021-03-25T17:27:46",
    plannedFinish: "2021-03-25T17:27:46",
    status: "Complete",
    actualFinish: "2021-03-25T17:27:46",
    assessmentReport:
      "<div>Total Hosts: 5</div><div>Pass: 1</div><div>Fail: 1</div><div>Percentage: 0.0</div><div>---------</div><div><b>Hostname: admin-ipa02</b></div><div>Expected Result: MaxSessions present and not commented out</div><div>Actual Setting: #MaxSessions 10</div><div>Pass/Fail: Fail</div><div>---------</div>\n<div><b>Hostname: risk01</b></div><div>Expected Result: MaxSessions present and not commented out</div><div>Actual Setting: #MaxSessions 10</div><div>Pass/Fail: Fail</div><div>---------</div>",
    parentId: 1109,
    parentModule: "controls",
    createdBy: "service, api",
    createdById: "5e9daef6-788a-4414-a520-d7f2ea6659b9",
    dateCreated: "2021-03-25T17:28:02.0420578",
    lastUpdatedBy: "service, api",
    lastUpdatedById: "5e9daef6-788a-4414-a520-d7f2ea6659b9",
    dateLastUpdated: "2021-03-25T17:28:02.0420589",
  },
];
