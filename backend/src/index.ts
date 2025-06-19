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

const typeDefs = `#graphql

type RandomGame {
  id: ID
  name: String
}

type Game {
  id: ID
  name: String
}

type Query {
  randomGame: RandomGame
  topGames: [Game!]
}
`;

const resolvers = {
  // Get a random game from IGDB
  Query: {
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
