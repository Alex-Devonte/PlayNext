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
    const responseText = `
          You are an IGDB query generator. Use this mapping table:
          Genres: ${JSON.stringify(IGDB_MAPPING.genres)}
          Platforms: ${JSON.stringify(IGDB_MAPPING.platforms)}
          Game Modes: ${JSON.stringify(IGDB_MAPPING.game_modes)}
          Player Perspectives: ${JSON.stringify(IGDB_MAPPING.player_perspectives)}

          User asked: "${prompt}"

          Return ONLY valid JSON. Do not include explanations, code fences, or extra text.
          The JSON format must be:
          {
            "genres": [...],
            "platforms": [...],
            "gameModes": [...],
            "perspectives": [...]
          }

          When generating recommendations:
          - Use ONLY numeric IDs for genres, platforms, and themes. DO NOT use text labels.
          - If a category array is empty, populate it with AT LEAST 2 random valid numeric IDs from that category. NEVER leave an array empty.
          - Try to ensure the platform array is varied and not always falling back to pc: [6] or playstation 4: [48].
          - If the array is not empty, leave it as-is.
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: responseText }],
        },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // disables thinking
        },
      },
    });
    return response.text ?? "";
  } catch (err) {
    console.error("Gemini error:", err);
    return "Sorry, something went wrong.";
  }
}
