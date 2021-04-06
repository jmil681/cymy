import logo from "./logo.svg";
import "./App.css";
import "./tailwind.output.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Login from "./Login";
import Assessments from "./Assessments";
import CaretDown from "./icons/caretDown.svg";
import Hamburger from "./icons/bars-solid.svg";
import PatternFly from "./icons/patternfly.svg";

function App() {
  const [token, setToken] = useLocalStorage<string>("auth", "");
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  return (
    <div className="bg-gray-700 min-h-full">
      {token ? (
        <div className="h-full text-gray-200 flex-grow">
          <header className="fixed top-0 inset-x-0 bg-gray-900 h-16 flex items-center z-50">
            <div className="text-2xl pl-4 flex items-center flex-grow">
              <span
                onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                className="p-2 h-8 w-8 cursor-pointer active:bg-opacity-10 active:bg-white rounded-full mr-4 md:hidden"
              >
                <Hamburger />
              </span>
              <div>
                <PatternFly />
              </div>
            </div>
            <button
              onClick={() => setToken("")}
              className="bg-green-700 px-4 py-2 m-2 rounded-md uppercase font-bold"
            >
              Logout
            </button>
          </header>
          <main className="sm:flex sm:min-h-screen pt-16">
            <div
              className={`bg-gray-600 fixed w-full sm:static sm:w-60 sm:flex-shrink-0 ${
                showSidebarMobile ? "block" : "hidden sm:block"
              }`}
            >
              {sidebarItems()}
            </div>
            <div className="flex-grow p-4 sm:p-8">
              <Switch>
                <Route path="/assessments">
                  <Assessments
                    token={token}
                    onTokenExpired={() => setToken("")}
                  />
                </Route>
                <Route path="/">
                  <h1 className="text-5xl mb-8">Home</h1>
                </Route>
              </Switch>
            </div>
          </main>
        </div>
      ) : (
        <Login onSuccess={setToken} />
      )}
    </div>
  );
}

const sidebarItems = () => (
  <>
    <AccordionItemsGroup
      title="Items group 1"
      items={[
        {
          text: "Home",
          link: "/",
        },
        {
          text: "Something else",
          link: "/ars",
        },
      ]}
    />
    <AccordionItemsGroup
      title="Items group 2"
      items={[
        {
          text: "Assessments",
          link: "/assessments",
        },
      ]}
    />
  </>
);

type Item = {
  text: string;
  link: string;
};

function AccordionItemsGroup({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  const [isOpen, setIsOpen] = useLocalStorage(`SectionOpen ${title}`, false);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 uppercase text-sm font-bold tracking-wider cursor-pointer flex items-center"
      >
        <div className="flex-grow">{title}</div>
        <div
          className="h-4 w-4"
          style={{ transform: isOpen ? "rotate(180deg)" : "" }}
        >
          <CaretDown />
        </div>
      </div>
      <div className={`shadow-inner ${isOpen ? "block" : "hidden"} `}>
        {items.map((item) => (
          <NavLink
            key={item.link}
            className="block p-4 pl-6 border-l-8 border-transparent bg-black bg-opacity-20"
            exact
            activeClassName="border-l-8 border-green-600 bg-green-900"
            to={item.link}
          >
            {item.text}
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default App;
