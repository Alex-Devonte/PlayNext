import { getAccessToken } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const accessToken = await getAccessToken();
const headers = {
  "Client-ID": process.env.TWITCH_CLIENT_ID,
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/json",
};

// Helper function to make POST requests to IGDB
async function igdbPost(endpoint, query) {
  return axios.post(process.env.BASE_URL + endpoint, query, { headers });
}

function shuffleRecommendations<T>(arr: T[], limit: number) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i * 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr.slice(0, limit);
}

const typeDefs = `#graphql

input userPreferencesInput {
  genres: [Int]
  platforms: [Int]
  gameModes: [Int]
  perspectives: [Int]
}

type RandomGame {
  id: ID!
  name: String
}

type Game {
  id: ID!
  name: String
}

type RatingCategory {
  id: ID
  rating: String
}

type RatingOrganization {
  id: ID
  name: String
}

type Genre {
  id: ID
  name: String
}

type AgeRating {
  id: ID
  ratingCategory: RatingCategory
  organization: RatingOrganization
}

type Cover {
  url: String
}

type ReleaseDate {
  id: ID
  human: String              
}

type Keyword {
  id: ID
  name: String
}

type Company {
  id: ID
  name: String
}

type InvolvedCompany {
  company: Company
  developer: Boolean
  publisher: Boolean
}

type Platform {
  id: ID
  name: String
}

type Perspective {
  id: ID
  name: String
}

type GameMode {
  id: ID
  name: String  
}

type timeToBeat {
  hastily: Int
  normally: Int
  completely: Int
}

type GameDetail {
  id: ID!
  name: String
  summary: String
  genres: [Genre]
  ageRatings: [AgeRating]
  cover: Cover
  releaseDates: [ReleaseDate]
  keywords: [Keyword]
  developers: [Company]
  publishers: [Company]
  platforms: [Platform]
  perspectives: [Perspective]
  gameModes: [GameMode]
  timeToBeat: timeToBeat
}


type Query {
  recommendedGames(preferences: userPreferencesInput): [GameDetail!]
  randomGame: RandomGame
  topGames: [Game!]
  gameDetail(id: ID!): GameDetail
}
`;

const resolvers = {
  Query: {
    // Gets recommended games based on user preferences
    recommendedGames: async (_, { preferences }) => {
      try {
        const { genres, platforms, gameModes, perspectives } = preferences;
        const QUERY_LIMIT = 30;
        const RECOMMENDED_GAME_LIMIT = 15;

        // Combine all filters into a single query
        const filters = `genres = (${genres.join(",")}) &
        platforms = (${platforms.join(",")}) &      
        game_modes = (${gameModes.join(",")}) &        
        player_perspectives = (${perspectives.join(",")})`;

        const query = `where ${filters}; limit ${QUERY_LIMIT};`;

        console.log("IGDB query for recommended game:", query);
        console.log("User preferences:", preferences);

        const response = await igdbPost("/games", query);

        // Get the ids from the response
        const gameIds = response.data.map((game) => game.id);
        console.log("Game IDs from response:", gameIds);

        const randomizedGameIds = shuffleRecommendations(gameIds, RECOMMENDED_GAME_LIMIT);

        // Grab details for each game using the gameDetail resolver
        const gameRecommendations = await Promise.all(
          randomizedGameIds.map((id) => resolvers.Query.gameDetail(_, { id }))
        );
        console.log("Game recommendations:", gameRecommendations);

        return gameRecommendations;
      } catch (error) {
        console.error("Failed to fetch recommended game:", error.response?.data || error.message);
        return [];
      }
    },
    // Get a random game from IGDB
    randomGame: async () => {
      try {
        // Get the current timestamp in seconds
        const now = Math.floor(Date.now() / 1000);
        const limit = 1;

        // Get the count of games that match the criteria

        // game_type = 0 means main games, not DLC or expansions
        // rating != null filters out games without ratings
        // first_release_date < now filters out future releases

        const countResponse = await igdbPost(
          "/games/count",
          `where game_type = 0 & rating != null & first_release_date < ${now};`
        );

        const totalCount = countResponse.data.count;

        // Create a random offset based on the total count which allows a different game to be selected each time
        const offset = Math.floor(Math.random() * (totalCount - limit));

        const response = await igdbPost(
          "/games",
          `fields name; where game_type = 0 &  first_release_date < ${now} & rating != null; limit ${limit}; offset ${offset};`
        );

        console.log("Fetched game:", response.data);
        return {
          id: response.data[0].id,
          name: response.data[0].name,
        };
      } catch (error) {
        console.error("Failed to fetch random game:", error.response?.data || error.message);
        return null;
      }
    },
    // Get the top 5 games by playing popularity (3)
    topGames: async () => {
      try {
        // Query popularity_primitives endpoint filtering for Playing (3)
        const response = await igdbPost(
          "/popularity_primitives",
          `fields game_id, value, popularity_type;
           where popularity_type = (3);
           sort value desc;
           limit 5;`
        );

        // response.data is an array of popularity primitives,
        // but we only have game_id here, no game name
        // So we need to fetch game details for each game_id

        const gameIds = [...new Set(response.data.map((entry) => entry.game_id))];

        if (gameIds.length === 0) return [];

        // Fetch game info for all gameIds
        const gamesResponse = await igdbPost(
          "/games",
          `fields id, name;
           where id = (${gameIds.join(",")});`
        );

        const gamesMap = new Map();
        for (const game of gamesResponse.data) {
          gamesMap.set(game.id, { id: game.id, name: game.name, popularity: [] });
        }

        // Attach popularity data to each game
        for (const entry of response.data) {
          if (gamesMap.has(entry.game_id)) {
            gamesMap.get(entry.game_id).popularity.push({
              popularity_type: entry.popularity_type,
              value: entry.value,
            });
          }
        }

        return Array.from(gamesMap.values());
      } catch (error) {
        console.error("Failed to fetch top games by popularity primitives:", error.response?.data || error.message);
        return [];
      }
    },
    // Get detailed information about a specific game by its ID
    gameDetail: async (_, { id }) => {
      try {
        const response = await igdbPost(
          "/games",
          `fields name, summary, genres.name, age_ratings.organization.name, age_ratings.rating_category.rating,
           cover.url, release_dates.date, release_dates.human, keywords.name,
           involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
           platforms.name, player_perspectives.name, game_modes.name;
           where id = ${id};`
        );

        //Get play time data
        const timeToBeatData = await igdbPost(
          "/game_time_to_beats",
          `fields hastily, normally, completely; where game_id = ${id};`
        );

        const responseData = response.data[0];

        function convertSecondsToHours(seconds) {
          return Math.floor(seconds / 3600);
        }

        const name = responseData.name;
        const summary = responseData.summary;
        const genres = responseData.genres || [];
        const ratings = responseData.age_ratings || [];
        const coverUrl = responseData.cover;
        const releaseDates = (responseData.release_dates || []).sort((a, b) => a.date - b.date)[0]; // Order release dates by date to get the earliest first
        const keywords = responseData.keywords || [];
        const involvedCompanies = responseData.involved_companies || [];
        const platforms = responseData.platforms || [];
        const perspectives = responseData.player_perspectives || [];
        const gameModes = responseData.game_modes || [];
        const timesToBeat = timeToBeatData.data?.[0]
          ? {
              hastily: convertSecondsToHours(timeToBeatData.data[0].hastily),
              normally: convertSecondsToHours(timeToBeatData.data[0].normally),
              completely: convertSecondsToHours(timeToBeatData.data[0].completely),
            }
          : {
              hastily: null,
              normally: null,
              completely: null,
            };

        // Map involved companies to separate developers and publishers
        const developers = involvedCompanies
          ?.filter((c) => c.developer)
          .map((c) => ({
            id: c.company?.id,
            name: c.company?.name,
          }));

        const publishers = involvedCompanies
          ?.filter((c) => c.publisher)
          .map((c) => ({
            id: c.company?.id,
            name: c.company?.name,
          }));

        const gameDetails = {
          id: id,
          name: name,
          summary: summary,
          genres: genres.map((genre) => ({ id: genre.id, name: genre.name })),
          ageRatings: ratings.map((rating) => ({
            id: rating.id,
            ratingCategory: {
              id: rating.rating_category.id,
              name: rating.rating_category.name,
              description: rating.rating_category.description,
            },
            organization: {
              id: rating.organization.id,
              name: rating.organization.name,
              description: rating.organization.description,
            },
          })),
          cover: coverUrl ? { url: coverUrl.url } : null,
          releaseDates: releaseDates ? [{ id: releaseDates.id, human: releaseDates.human }] : [],
          keywords: keywords.map((keyword) => ({ id: keyword.id, name: keyword.name })),
          developers,
          publishers,
          platforms: platforms.map((platform) => ({ id: platform.id, name: platform.name })),
          perspectives: perspectives.map((perspective) => ({ id: perspective.id, name: perspective.name })),
          gameModes: gameModes.map((mode) => ({ id: mode.id, name: mode.name })),
          timeToBeat: timesToBeat,
        };

        return gameDetails;
      } catch (error) {
        console.error("Failed to fetch game detail:", error.response?.data || error.message);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
