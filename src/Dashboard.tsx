import logo from "./logo.svg";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

import { fetchAssets, fetchAssessments, useApiEndpoint } from "./store/api";
import Overview from "./pages/Overview";
import AssessmentsModals from "./pages/AssessmentsModals";
import Assessments from "./pages/Assessments";
import docsPages from "./store/documents.yaml";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Dashboard = ({
  token,
  onTokenExpired,
}: {
  token: string;
  onTokenExpired: () => void;
}) => {
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  const assets = useApiEndpoint(fetchAssets, token, onTokenExpired);
  const assessments = useApiEndpoint(fetchAssessments, token, onTokenExpired);

  const assetsSidebarItems =
    (assets.result &&
      assets.result.map((asset) => ({
        text: asset.name,
        link: `/assessments/${asset.name}`,
        depth: 1,
      }))) ||
    [];

  return (
    <div className="h-full text-gray-200 flex-grow">
      <Header
        onMenuClick={() => setShowSidebarMobile(!showSidebarMobile)}
        onLogout={onTokenExpired}
      />
      <main className="sm:flex sm:min-h-screen pt-16">
        <Sidebar
          mobileShow={showSidebarMobile}
          assetsItems={assetsSidebarItems}
        />
        <div className="flex-grow p-4 sm:p-8">
          <Switch>
            <Route path="/assessments/:assetName">
              {assets.error && assets.error.message}
              {assessments.error && assessments.error.message}
              {(assets.result && assessments.result && (
                <Assessments
                  assets={assets.result}
                  assessments={assessments.result}
                />
              )) ||
                "Loading..."}
            </Route>

            <Route path="/assessments/">
              <Overview />
            </Route>

            <Route path="/assessments2/">
              {(assets.result && assessments.result && (
                <AssessmentsModals
                  assets={assets.result}
                  assessments={assessments.result}
                />
              )) ||
                "Loading..."}
            </Route>

            {Object.values(docsPages)
              .map((items) => Object.values(items))
              .flat()
              .map(({ path, content }) => (
                <Route key={path} path={path}>
                  {content}
                </Route>
              ))}
            <Route path="/">
              <h1 className="text-5xl mb-8">Home</h1>
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
