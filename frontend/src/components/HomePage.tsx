import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1 className="text-8xl">PlayNext</h1>
      <h2 className="text-4xl">PlayNext subheading</h2>
      <Link to="/questionnaire"> Take the questionnaire </Link>
      <Link to="/random"> Find a random game </Link>
    </div>
  );
}

export default HomePage;
