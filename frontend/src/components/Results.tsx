import { gql, useQuery } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import GameCard from "./GameCard";
import noCoverFallback from "/no_cover.png";

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
    variables: { preferences },
  });

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("Recommended games:", data.recommendedGames);

  return (
    <div>
      <h2>Your Game Recommendations</h2>
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
  );
}

export default Results;
