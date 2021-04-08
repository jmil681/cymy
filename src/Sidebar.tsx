import logo from "./logo.svg";
import docsPages from "./store/documents.yaml";
import CaretDown from "./icons/caretDown.svg";
import useLocalStorage from "./hooks/useLocalStorage";
import { NavLink } from "react-router-dom";
import cx from "classnames";

function Sidebar({
  mobileShow,
  assetsItems,
}: {
  mobileShow: boolean;
  assetsItems: Item[];
}) {
  return (
    <div
      className={`bg-gray-600 fixed inset-0 pt-16 border-r border-black border-opacity-40 sm:pt-0 overflow-auto sm:static sm:w-60 sm:flex-shrink-0 ${
        mobileShow ? "block" : "hidden sm:block"
      }`}
    >
      {sidebarItems(assetsItems)}
    </div>
  );
}

const sidebarItems = (assetsItems: Item[]) => (
  <>
    <AccordionItemsGroup
      key={1}
      title="Org Area"
      items={[
        {
          text: "Home",
          link: "/",
        },
        {
          text: "Account",
          link: "/ars",
        },
      ]}
    />
    <AccordionItemsGroup
      key={2}
      title="Dashboard"
      items={[
        {
          text: "Overview",
          link: "/assessments",
        },
        assetsItems,
        {
          text: "Topology",
          link: "/ars",
        },
      ].flat()}
    />
    <AccordionItemsGroup
      key={3}
      title="Items group 3"
      items={[
        {
          text: "Random",
          link: "/alsoassessments",
        },
      ]}
    />
    <AccordionItemsGroup
      key={4}
      title="Items group 4"
      items={[
        {
          text: "Placeholder",
          link: "/placeholder2",
        },
      ]}
    />
    {Object.entries(docsPages).map(([sectionName, items]) => (
      <AccordionItemsGroup
        key={sectionName}
        title={sectionName}
        items={Object.entries(items).map(([pageName, item]) => ({
          text: pageName,
          link: item.path,
        }))}
      />
    ))}
  </>
);

type Item = {
  text: string;
  link: string;
  depth?: number;
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
            key={item.text}
            className={cx(
              "block p-4 py-2 border-l-8 border-transparent bg-black bg-opacity-20",
              {
                "bg-opacity-40 border-white border-opacity-20": !!item.depth,
              }
            )}
            style={{ paddingLeft: `${1 + (item.depth || 0) * 1.5}rem` }}
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

export default Sidebar;
