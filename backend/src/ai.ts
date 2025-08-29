import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//Mapping from IGDB api for AI to utilize
export const IGDB_MAPPING = {
  genres: {
    "point-and-click": 2,
    fighting: 4,
    shooter: 5,
    music: 7,
    platform: 8,
    puzzle: 9,
    racing: 10,
    "real time strategy": 11,
    rts: 11,
    "role-playing(RPG)": 12,
    simulator: 13,
  },
  platforms: {
    "pc (microsoft windows)": 6,
    "playstation 4": 48,
    "playstation 5": 167,
    "xbox one": 49,
    "xbox series x|s": 169,
    "nintendo switch": 130,
    "playstation vr": 165,
    "playstation vr2": 390,
    "oculus quest": 384,
    "meta quest 2": 386,
    "oculus vr": 162,
    steamvr: 163,
  },
  game_modes: {
    "single player": 1,
    multiplayer: 2,
    "co-op": 3,
    mmo: 5,
    "battle royale": 6,
  },
  player_perspectives: {
    "first person": 1,
    "third person": 2,
    "bird view/isometric": 3,
    "side view": 4,
    "text(Visual Novel)": 5,
    auditory: 6,
    "virtual reality": 7,
  },
};

export async function askGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // disables thinking
        },
      },
    });
    //console.log("AI RESPONSE:", response.text);
    return response.text ?? "";
  } catch (err) {
    console.error("Gemini error:", err);
    return "Sorry, something went wrong.";
  }
}
