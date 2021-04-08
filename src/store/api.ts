import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import assessmentsMockData from "./assessments.json";
import assetsMockData from "./assets.json";

const TOKEN_EXPIRED_ERROR = "Token expired";
const ASSESSMENTS_ENDPOINT = "/api/atlasity/assessments/getAll";
const ASSETS_ENDPOINT = "/api/atlasity/assets/getAll";
const AUTH_ENDPOINT = "/api/atlasity/authentication/login";

type ApiEndpoint<T> = (token: string) => Promise<T>;

export function useApiEndpoint<T>(
  apiEndpoint: ApiEndpoint<T>,
  token: string,
  tokenExpired: () => void
) {
  const asyncRequest = useAsync(apiEndpoint, [token]);

  useEffect(() => {
    if (
      asyncRequest.error &&
      asyncRequest.error.message === TOKEN_EXPIRED_ERROR
    ) {
      tokenExpired();
    }
  }, [asyncRequest.error]);

  return asyncRequest;
}

type AuthResponse = {
  id: string;
  auth_token: string;
  expires_in: number;
};

export const auth = async (user: string, pass: string): Promise<AuthResponse> =>
  await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "*/*",
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
      return assessmentsMockData;
    } else {
      throw new Error(response.statusText);
    }
  });

export type Asset = {
  id: number;
  uuid: string;
  name: string;
  ipAddress: string;
  assetOwner: string;
  assetOwnerId: string;
  assetType: string;
  cpu: number;
  ram: number;
  diskStorage: number;
  status: string;
  parentId: number;
  dateCreated: string;
  dateLastUpdated: string;
};

export const fetchAssets = async (token: string): Promise<Asset[]> =>
  await fetch(ASSETS_ENDPOINT, {
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
      return assetsMockData;
    } else {
      throw new Error(response.statusText);
    }
  });
