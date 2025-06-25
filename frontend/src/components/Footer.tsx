const Footer = () => {
  return (
    <div className="relative w-full h-auto flex flex-col items-start justify-center px-10 py-12 text-white text-left">
      {/* Inset top border */}
      <div className="absolute left-10 right-10 top-0 h-[1px] bg-white bg-opacity-20" />
      <div className="w-auto h-auto flex flex-row items-center justify-center mb-1">
        <img className="mr-2" src="/logo.png" style={{ width: "15px", height: "15px" }} />
        <h2 className="text-md font-bold italic">FirstIssue</h2>
      </div>
      <p className="text-xs font-light">
        © 2025 FirstIssue. A tool for discovering open source projects.
      </p>
    </div>
  );
};

export default Footer;
