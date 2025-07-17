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
    <div className="bg-dark mb-[-100px] flex h-screen flex-col justify-center">
      <div className="my-10 flex flex-col items-center justify-center gap-5">
        <h1 className="text-light mt-3 text-8xl font-bold">PlayNext</h1>
        <h2 className="text-light text-3xl italic">
          Discover what to play next
        </h2>
      </div>
      <div className="flex flex-col items-center gap-5 md:flex-row md:justify-center">
        <Link
          to="/questionnaire"
          className="bg-primary hover:bg-darkerPrimary active:bg-darkerPrimary w-[300px] rounded-3xl p-4 text-center text-white shadow-xl transition-colors duration-150 ease-in"
        >
          Take the questionnaire
        </Link>
        <a
          href="#"
          onClick={() => getRandomGame()}
          className="bg-primary hover:bg-darkerPrimary active:bg-darkerPrimary w-[300px] rounded-3xl p-4 text-center text-white shadow-xl transition-colors duration-150 ease-in"
        >
          Find a random game
        </a>
      </div>
    </div>
  );
}

export default HomePage;
