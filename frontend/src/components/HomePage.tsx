import { gql, useLazyQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const GET_RANDOM_GAME = gql`
    query GetRandomGame {
      randomGame {
        id
        name
      }
    }
  `;

  const [getRandomGame, { loading }] = useLazyQuery(GET_RANDOM_GAME, {
    fetchPolicy: "no-cache", // Ensures a a new game is fetched each time
    onCompleted: (data) => {
      if (data?.randomGame.id) {
        console.log(data.randomGame, " Random game fetched successfully");
        navigate(`/game/${data.randomGame.id}`, {
          state: { id: data.randomGame.id },
        });
      }
    },
    onError: (error) => {
      return `Error! ${error}`;
    },
  });

  if (loading) return <p>Loading your random game...</p>;

  return (
    <div>
      <h1 className="text-8xl">PlayNext</h1>
      <h2 className="text-4xl">PlayNext subheading</h2>
      <Link to="/questionnaire"> Take the questionnaire </Link>
      <a href="#" onClick={() => getRandomGame()}>
        Find a random game
      </a>
    </div>
  );
}

export default HomePage;
