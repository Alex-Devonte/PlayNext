import { gql, useQuery } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import GameCard from "./GameCard";
import noCoverFallback from "/no_cover.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Results() {
  const RECOMMENDATIONS_QUERY = gql`
    query RecommendedGames($preferences: userPreferencesInput!) {
      recommendedGames(preferences: $preferences) {
        id
        name
        summary
        cover {
          url
        }
      }
    }
  `;
  const location = useLocation();
  const navigate = useNavigate();

  const { answers } = location.state;

  const preferences = {
    genres: answers.genre || [],
    platforms: answers.platform || [],
    gameModes: answers.gameMode || [],
    perspectives: answers.perspective || [],
  };

  interface Game {
    id: string;
    name: string;
    summary: string;
    cover: {
      url: string;
    };
  }
  const { data, loading, error } = useQuery(RECOMMENDATIONS_QUERY, {
    fetchPolicy: "no-cache",
    variables: { preferences },
  });

  // If only one game is recommended, redirect to its detail page
  useEffect(() => {
    if (data?.recommendedGames.length === 1) {
      const gameID = data.recommendedGames[0].id;
      navigate(`/game/${gameID}`, {
        state: { id: gameID },
      });
    }
  }, [data, navigate]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("Recommended games:", data.recommendedGames);
  if (data.recommendedGames.length == 0) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center text-center">
        <p className="mb-10 text-xl md:text-2xl lg:text-4xl">
          No recommendations found. Try again!
        </p>
        <Link
          to="/questionnaire"
          className="bg-primary text-light hover:bg-darkerPrimary w-[80px] cursor-pointer rounded p-2 transition-colors duration-150"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-20 p-1">
      <h2 className="text-primary mt-5 text-center text-4xl font-bold md:mb-10">
        Your Game Recommendations
      </h2>
      <div className="flex w-full flex-col items-center gap-5 p-5 md:grid md:grid-cols-2 md:justify-items-center md:overflow-x-auto md:p-0 lg:mx-auto lg:grid-cols-4 lg:justify-items-normal lg:overflow-x-hidden lg:p-5 xl:grid-cols-5">
        {data.recommendedGames.map((game: Game) => (
          <Link to={`/game/${game.id}`} key={game.id}>
            <GameCard
              key={game.id}
              name={game.name}
              coverUrl={game.cover?.url ? game.cover?.url : noCoverFallback}
              summary={game.summary}
            />
          </Link>
        ))}
      </div>
      <div className="mt-10 lg:hidden">
        <svg
          onClick={() => window.scrollTo(0, 0)}
          className="animate-smallBounce absolute right-5 size-14"
          fill="#FED766"
          version="1.1"
          viewBox="-4 -4 48.00 48.00"
          stroke="#FED766"
        >
          <g strokeWidth="0"></g>
          <g strokeLinecap="round" strokeLinejoin="round"></g>
          <g>
            <g>
              <path d="M20,0C8.973,0,0,8.973,0,20c0,11.027,8.973,20,20,20c11.027,0,20-8.973,20-20C40,8.973,31.027,0,20,0z M28.018,19.752 c-0.451,0.531-1.094,0.805-1.738,0.805c-0.521,0-1.047-0.179-1.477-0.543l-2.521-2.141v9.186c0,1.26-1.021,2.28-2.281,2.28 c-1.26,0-2.281-1.021-2.281-2.28v-9.186l-2.521,2.141c-0.96,0.816-2.4,0.698-3.216-0.262c-0.816-0.961-0.698-2.4,0.262-3.216 l6.279-5.333c0.852-0.723,2.102-0.723,2.955,0l6.278,5.333C28.716,17.352,28.834,18.791,28.018,19.752z"></path>{" "}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Results;
