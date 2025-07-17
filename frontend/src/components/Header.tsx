import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  //Hide the header on the home page
  if (location.pathname === "/") {
    return <></>;
  }

  return (
    <header className="bg-dark w-full px-4 py-3">
      <div>
        <Link
          to="/"
          className="text-light hover:text-primary active:text-primary text-2xl font-bold"
        >
          PlayNext
        </Link>
      </div>
    </header>
  );
}
export default Header;
