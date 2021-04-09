import Hamburger from "./icons/bars-solid.svg";
import PatternFly from "./icons/patternfly.svg";

const Header = ({
  onMenuClick,
  onLogout,
}: {
  onMenuClick: () => void;
  onLogout: () => void;
}) => (
  <header className="fixed top-0 inset-x-0 bg-gray-900 h-16 flex items-center z-30">
    <div className="text-2xl pl-4 flex items-center flex-grow">
      <span
        onClick={onMenuClick}
        className="p-2 h-8 w-8 cursor-pointer active:bg-opacity-10 active:bg-white rounded-full mr-4 md:hidden"
      >
        <Hamburger />
      </span>
      <div>
        <PatternFly />
      </div>
    </div>
    <button
      onClick={onLogout}
      className="bg-green-700 px-4 py-2 m-2 rounded-md uppercase font-bold"
    >
      Logout
    </button>
  </header>
);

export default Header;
