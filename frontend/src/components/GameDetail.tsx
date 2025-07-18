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
    <div className="text-dark mx-auto mb-10 px-5 py-10 lg:px-16 xl:max-w-3/5">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="mx-auto w-full max-w-md lg:w-1/3">
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
      <div className="mt-5 flex items-center justify-center lg:hidden">
        <a href="#">Back to Top</a>
      </div>
    </div>
  );
}
export default GameDetail;
