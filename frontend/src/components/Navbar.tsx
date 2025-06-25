import GradientButton from "./GradientButton";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-[60px] flex flex-row items-center justify-between px-10 bg-bg-black/60 backdrop-blur-md text-white">
      {/* Gradient border bottom */}
      <div className="pointer-events-none absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80 z-50" />
      {/* Logo */}
      <div className="w-auto h-full flex flex-row items-center justify-center text-white">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: "30px", height: "30px" }}
        />
        <h1 className="text-xl font-bold italic ml-1">FirstIssue</h1>
      </div>
      {/* Navbar */}
      <nav>
        <ul className='flex flex-row items-center justify-center ml-4 gap-6'>
          <li><a href="#hero" className="text-xs hover:underline">Home</a></li>
          <li><a href="#discovery" className="text-xs hover:underline">Discovery</a></li>
          <li><a href="#how-it-works" className="text-xs hover:underline">How It Works</a></li>
          <li>
            <a href="#ready">
              <GradientButton className="text-xs px-4 py-1 h-8">Get Started</GradientButton>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
