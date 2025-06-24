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
        <ul className="flex flex-row items-center justify-center ml-4">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
