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

 if (!game) return <p>No game details found.</p>;

 return (
   <div className="mx-auto mb-10 px-5 py-10 lg:px-16">
     <div className="flex flex-col gap-8 lg:flex-row">
       <div className="mx-auto w-full max-w-md lg:w-1/3">
         <img
           src={game.cover.url.replace("t_thumb", "t_cover_big")}
           alt={`${game.name} cover`}
           className="h-auto w-full rounded-lg object-cover"
         />
       </div>

       <div className="flex-1">
         <h1 className="mb-5 text-4xl font-bold md:text-5xl lg:text-6xl">
           {game.name}
         </h1>
         <p className="mb-5">{game.summary}</p>

         <div className="flex flex-wrap gap-4">
           <p>
             <span className="font-bold">Genres:</span>{" "}
             {game.genres.map((genre) => genre.name).join(", ")}
           </p>
           <p>
             <span className="font-bold">Platforms:</span>{" "}
             {game.platforms.map((platform) => platform.name).join(", ")}
           </p>
           <p>
             <span className="font-bold">Release Date:</span>{" "}
             {game.releaseDates[0]?.human}
           </p>
         </div>
       </div>
     </div>

     <div className="mt-10 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
       <div>
         <h2 className="mb-1 text-lg font-bold">Developer</h2>
         <p>{game.developers.map((developer) => developer.name).join(", ")}</p>
       </div>

       <div>
         <h2 className="mb-1 text-lg font-bold">Publisher</h2>
         <p>{game.publishers.map((publisher) => publisher.name).join(", ")}</p>
       </div>

       <div>
         <h2 className="mb-1 text-lg font-bold">Keywords</h2>
         <p className="italic">
           {game.keywords.map((keyword) => keyword.name).join(", ")}
         </p>
       </div>

       <div>
         <h2 className="mb-1 text-lg font-bold">Perspective</h2>
         <p>
           {game.perspectives.map((perspective) => perspective.name).join(", ")}
         </p>
       </div>

       <div>
         <h2 className="mb-1 text-lg font-bold">Game Modes</h2>
         <p>{game.gameModes.map((mode) => mode.name).join(", ")}</p>
       </div>

       <div className="mb-5">
         <h2 className="mb-1 text-lg font-semibold">Age Ratings</h2>
         <ul className="grid grid-cols-3">
           {game.ageRatings.map((rating) => (
             <li key={rating.id}>{rating.organization.name}</li>
           ))}
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
