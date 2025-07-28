import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";

function GameDetail() {
  // Grab the game ID from the URL parameters
  const { id } = useParams();

  const [showMore, setShowMore] = useState(false);
  const KEYWORD_LIMIT = 150;

  const DETAIL_QUERY = gql`
    query GameDetail($id: ID!) {
      gameDetail(id: $id) {
        id
        name
        summary
        genres {
          id
          name
        }
        ageRatings {
          id
          ratingCategory {
            id
            rating
          }
          organization {
            id
            name
          }
        }
        cover {
          url
        }
        releaseDates {
          id
          human
        }
        keywords {
          id
          name
        }
        developers {
          id
          name
        }
        publishers {
          id
          name
        }
        platforms {
          id
          name
        }
        perspectives {
          id
          name
        }
        gameModes {
          id
          name
        }
        timeToBeat {
          hastily
          normally
          completely
        }
      }
    }
  `;

  interface GameDetailData {
    gameDetail: {
      id: string;
      name: string;
      summary: string;
      cover: { url: string };
      genres: { id: string; name: string }[];
      platforms: { id: string; name: string }[];
      releaseDates: { id: string; human: string }[];
      developers: { id: string; name: string }[];
      publishers: { id: string; name: string }[];
      keywords: { id: string; name: string }[];
      perspectives: { id: string; name: string }[];
      gameModes: { id: string; name: string }[];
      ageRatings: {
        id: string;
        ratingCategory: { id: string; rating: string | null };
        organization: { id: string; name: string };
      }[];
      timeToBeat: {
        hastily: number | null;
        normally: number | null;
        completely: number | null;
      };
    };
  }

  const { loading, error, data } = useQuery<GameDetailData>(DETAIL_QUERY, {
    variables: { id: id },
  });

  if (loading) return <p>Loading game details...</p>;
  if (error) return <p>Error fetching game details: {error.message}</p>;

  console.log("Game detail data:", data);
  const game = data?.gameDetail;

  //Display keywords if they exist, otherwise show N/A
  const keywordsText =
    game && game.keywords?.length > 0
      ? game?.keywords.map((keyword) => keyword.name).join(", ")
      : "N/A";

  //Boolean for checking length of keywords
  const overKeywordLimit = keywordsText.length > KEYWORD_LIMIT;

  if (!game) return <p>No game details found.</p>;

  return (
    <div>
      <div className="text-dark mb-10 px-5 py-10 lg:mx-auto lg:mt-10 lg:max-w-5xl lg:rounded-xl lg:border lg:border-gray-300 lg:bg-white lg:px-16 lg:shadow-2xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="mx-auto w-10/12 md:w-1/2 lg:w-1/3">
            <img
              src={game.cover.url.replace("t_thumb", "t_cover_big")}
              alt={`${game.name} cover`}
              className="h-auto w-full rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-primary mb-5 text-4xl font-bold md:text-5xl lg:text-6xl">
              {game.name}
            </h1>
            <p className="mb-5">{game.summary}</p>
            <div className="flex flex-wrap gap-4">
              <p>
                <span className="font-bold">Genres:</span>{" "}
                <span className="text-primary font-semibold">
                  {game.genres.map((genre) => genre.name).join(", ")}
                </span>
              </p>
              <p>
                <span className="font-bold">Platforms:</span>{" "}
                <span className="text-primary font-semibold">
                  {game.platforms.map((platform) => platform.name).join(", ")}
                </span>
              </p>
              <p>
                <span className="font-bold">Release Date:</span>{" "}
                <span className="text-primary font-semibold">
                  {game.releaseDates[0]?.human}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-10 text-sm md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="mb-1 text-lg font-bold">Developer</h2>
            <p className="text-primary font-semibold">
              {game.developers?.length > 0
                ? game.developers.map((developer) => developer.name).join(", ")
                : "N/A"}
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-lg font-bold">Publisher</h2>
            <p className="text-primary font-semibold">
              {game.publishers?.length > 0
                ? game.publishers.map((publisher) => publisher.name).join(", ")
                : "N/A"}
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-lg font-bold">Keywords</h2>
            <p className="text-primary italic">
              {overKeywordLimit && !showMore
                ? `${keywordsText.substring(0, KEYWORD_LIMIT)}...`
                : keywordsText}
            </p>
            {overKeywordLimit && (
              <p
                className="text-secondary mt-1 cursor-pointer font-bold hover:underline"
                onClick={() => setShowMore((prev) => !prev)}
              >
                {showMore ? "Show less" : "Show more"}
              </p>
            )}
          </div>
          <div>
            <h2 className="mb-1 text-lg font-bold">Perspective</h2>
            <p className="text-primary font-semibold">
              {game.perspectives?.length > 0
                ? game.perspectives
                    .map((perspective) => perspective.name)
                    .join(", ")
                : "N/A"}
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-lg font-bold">Game Modes</h2>
            <p className="text-primary font-semibold">
              {game.gameModes?.length > 0
                ? game.gameModes.map((mode) => mode.name).join(", ")
                : "N/A"}
            </p>
          </div>
          <div className="mb-5">
            <h2 className="mb-1 text-lg font-semibold">Age Ratings</h2>
            <ul className="grid grid-cols-3">
              {game.ageRatings?.length > 0
                ? game.ageRatings.map((rating) => (
                    <li className="text-dark font-semibold" key={rating.id}>
                      {rating.organization.name}
                    </li>
                  ))
                : "N/A"}
            </ul>
          </div>
        </div>
        <svg
          onClick={() => window.scrollTo(0, 0)}
          className="animate-smallBounce absolute right-5 size-14 lg:hidden"
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
export default GameDetail;
