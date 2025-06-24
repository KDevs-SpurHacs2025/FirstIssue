const Navbar = () => {
  return (
    <div className="w-full h-[50px] flex flex-row items-center justify-between px-10 bg-gray-800 text-white">
      {/* Logo */}
      <div className="w-auto h-full flex flex-row items-center justify-center text-white">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: "30px", height: "30px" }}
        />
        <h1>FirstIssue</h1>
      </div>
      {/* Navbar */}
      <nav>
        <ul className='flex flex-row items-center justify-center ml-4 gap-6'>
          <li><a href="#hero" className="hover:underline">Home</a></li>
          <li><a href="#discovery" className="hover:underline">Discovery</a></li>
          <li><a href="#how-it-works" className="hover:underline">How It Works</a></li>
          <li><a href="#ready" className="hover:underline">Get Started</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
