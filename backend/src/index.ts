import { getAccessToken } from "./auth.js";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const accessToken = await getAccessToken();

const typeDefs = `#graphql

type PopularityDetail {
  type: String
  value: Float
}

type Game {
  id: ID
  name: String
  popularityDetails: [PopularityDetail]
}

type Query {
  topGames: [Game!]
}
`;

//Get the top 5 games by playing popularity (3)
const resolvers = {
  Query: {
    topGames: async () => {
      try {
        // Query popularity_primitives endpoint filtering for Playing (3)
        const response = await axios.post(
          process.env.BASE_URL + "/popularity_primitives",
          `fields game_id, value, popularity_type;
           where popularity_type = (3);
           sort value desc;
           limit 5;`,
          {
            headers: {
              "Client-ID": process.env.TWITCH_CLIENT_ID,
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        // response.data is an array of popularity primitives,
        // but we only have game_id here, no game name
        // So we need to fetch game details for each game_id

        const gameIds = [...new Set(response.data.map((entry) => entry.game_id))];

        if (gameIds.length === 0) return [];

        // Fetch game info for all gameIds
        const gamesResponse = await axios.post(
          process.env.BASE_URL + "/games",
          `fields id, name;
           where id = (${gameIds.join(",")});`,
          {
            headers: {
              "Client-ID": process.env.TWITCH_CLIENT_ID,
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
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
