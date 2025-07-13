import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  //Hide the header on the home page
  if (location.pathname === "/") {
    return <></>;
  }

  return (
    <header className="w-full bg-gray-900 px-4 py-3 text-white">
      <div>
        <Link to="/" className="text-2xl font-bold">
          PlayNext
        </Link>
      </div>
    </header>
  );
}
export default Header;
