import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const GET_RANDOM_GAME = gql`
    query GetRandomGame {
      randomGame {
        id
        name
      }
    }
  `;

  const ASK_AI = gql`
    query AskAI($prompt: String!) {
      askAI(prompt: $prompt) {
        genres
        platforms
        gameModes
        perspectives
      }
    }
  `;

  const [getRandomGame, { loading }] = useLazyQuery(GET_RANDOM_GAME, {
    fetchPolicy: "no-cache", // Ensures a a new game is fetched each time
    onCompleted: (data) => {
      if (data?.randomGame.id) {
        navigate(`/game/${data.randomGame.id}`, {
          state: { id: data.randomGame.id },
        });
      }
    },
    onError: (error) => {
      return `Error! ${error}`;
    },
  });

  const [askAI] = useLazyQuery(ASK_AI, {
    fetchPolicy: "no-cache",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the AI
    const { data: aiData } = await askAI({ variables: { prompt } });

    const answers = aiData.askAI;
    //console.log(answers);

    navigate("/results", { state: { answers } });
  };

  if (loading) return <p>Loading your random game...</p>;

  return (
    <div className="bg-dark mb-[-100px] flex h-screen flex-col justify-center">
      <div className="my-10 flex flex-col items-center justify-center gap-5">
        <h1 className="text-light mt-3 text-8xl font-bold">PlayNext</h1>
        <h2 className="text-light text-3xl italic">
          Discover what to play next
        </h2>
      </div>
      <div className="flex flex-col items-center gap-5 md:flex-row md:flex-wrap md:justify-center">
        <Link
          to="/questionnaire"
          className="bg-primary hover:bg-darkerPrimary active:bg-darkerPrimary w-[300px] rounded-3xl p-4 text-center text-white shadow-xl transition-colors duration-150 ease-in"
        >
          Take the questionnaire
        </Link>
        <a
          href="#"
          onClick={() => getRandomGame()}
          className="bg-primary hover:bg-darkerPrimary active:bg-darkerPrimary w-[300px] rounded-3xl p-4 text-center text-white shadow-xl transition-colors duration-150 ease-in"
        >
          Find a random game
        </a>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-darkerPrimary active:bg-darkerPrimary relative w-[300px] cursor-pointer rounded-3xl p-4 text-center text-white shadow-xl transition-colors duration-150 ease-in"
        >
          Try AI Recommendation
          <span className="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-yellow-400 px-1 text-xs font-bold text-black">
            Beta
          </span>
        </button>

        {/* AI Prompt Popup */}
        {isOpen && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="bg-dark relative w-[90%] max-w-md rounded-2xl p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-accent active:text-accent absolute top-3 right-3 cursor-pointer text-3xl font-bold text-white"
              >
                &times;
              </button>
              <label
                htmlFor="aiPrompt"
                className="text-light text-2xl font-semibold"
              >
                What kind of games are you interested in?
              </label>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  id="aiPrompt"
                  type="text"
                  autoFocus
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Multiplayer RPGs on PC"
                  className="my-6 rounded-lg p-3 text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-darkerPrimary cursor-pointer rounded-2xl p-3 text-white shadow transition-colors duration-150"
                >
                  Get Recommendations
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
