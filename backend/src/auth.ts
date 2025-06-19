import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getAccessToken(): Promise<string> {
  const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });

  return res.data.access_token;
}
