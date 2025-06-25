import GradientButton from "./GradientButton";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-[60px] flex flex-row items-center justify-between px-10 bg-bg-black/60 backdrop-blur-md text-white">
      {/* Gradient border bottom */}
      <div className="pointer-events-none absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80 z-50" />
      {/* Logo */}
      <Link
        to="/"
        className="w-auto h-full flex flex-row items-center justify-center text-white hover:opacity-90 transition-opacity duration-150"
      >
        <DataObjectIcon color="primary" fontSize="medium" />
        <h1 className="text-xl font-bold italic ml-1">FirstIssue</h1>
      </Link>
      {/* Navbar items only on home page and not on mobile */}
      {isHome && (
        <nav className="hidden md:block">
          <ul className="flex flex-row items-center justify-center ml-4 gap-6">
            <li>
              <a href="#hero" className="text-xs hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#discovery" className="text-xs hover:underline">
                Discovery
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="text-xs hover:underline">
                How It Works
              </a>
            </li>
            <li>
              <a href="#ready">
                <GradientButton className="w-auto h-auto text-xs px-3 py-1">
                  Get Started
                </GradientButton>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
