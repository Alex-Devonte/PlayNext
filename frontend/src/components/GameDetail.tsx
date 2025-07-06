import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

function GameDetail() {
  // Grab the game ID from the URL parameters
  const { id } = useParams();

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

  const { loading, error, data } = useQuery(DETAIL_QUERY, {
    variables: { id: id },
  });

  if (loading) return <p>Loading game details...</p>;
  if (error) return <p>Error fetching game details: {error.message}</p>;
  console.log("Game detail data:", data);

  return (
    <div>
      <h1>Game Detail</h1>
      <p>This is the game detail page.</p>
    </div>
  );
}
export default GameDetail;
