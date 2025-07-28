import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number[] }>({});
  const navigate = useNavigate();

  const questions = [
    {
      key: "genre",
      question: "What type of games do you enjoy?",
      options: [
        { id: 2, name: "Point-and-click" },
        { id: 4, name: "Fighting" },
        { id: 5, name: "Shooter" },
        { id: 7, name: "Music" },
        { id: 8, name: "Platform" },
        { id: 9, name: "Puzzle" },
        { id: 10, name: "Racing" },
        { id: 11, name: "Real Time Strategy (RTS)" },
        { id: 12, name: "Role-playing (RPG)" },
        { id: 13, name: "Simulator" },
      ],
    },
    {
      key: "platform",
      question: "What platforms do you play on?",
      options: [
        { id: 6, name: "PC (Microsoft Windows)" },
        { id: 48, name: "PlayStation 4" },
        { id: 167, name: "PlayStation 5" },
        { id: 49, name: "Xbox One" },
        { id: 169, name: "Xbox Series X|S" },
        { id: 130, name: "Nintendo Switch" },
        { id: 165, name: "PlayStation VR" },
        { id: 390, name: "PlayStation VR2" },
        { id: 384, name: "Oculus Quest" },
        { id: 386, name: "Meta Quest 2" },
        { id: 162, name: "Oculus VR" },
        { id: 163, name: "SteamVR" },
      ],
    },
    {
      key: "gameMode",
      question: "What game modes do you prefer?",
      options: [
        { id: 1, name: "Single player" },
        { id: 2, name: "Multiplayer" },
        { id: 3, name: "Co-op" },
        { id: 5, name: "MMO" },
        { id: 6, name: "Battle Royale" },
      ],
    },
    {
      key: "perspective",
      question: "Which camera perspective do you like?",
      options: [
        { id: 1, name: "First person" },
        { id: 2, name: "Third person" },
        { id: 3, name: "Bird view / Isometric" },
        { id: 4, name: "Side view" },
        { id: 5, name: "Text(Visual Novel)" },
        { id: 6, name: "Auditory" },
        { id: 7, name: "Virtual Reality" },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];

  // Handles selecting/unselecting an options
  const handleSelect = (questionKey: string, optionId: number) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionKey] || [];

      const updated = currentAnswers.includes(optionId)
        ? currentAnswers.filter((id) => id !== optionId) // Unselect if current option is already selected
        : [...currentAnswers, optionId]; // Select if not already selected

      return {
        ...prev,
        [questionKey]: updated,
      };
    });
  };

  // Handles going to previous question
  const handlePrev = () => {
    if (currentStep > 0) {
      window.scrollTo(0, 0);
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handles going to next question
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      window.scrollTo(0, 0);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    navigate("/results", { state: { answers } });
  };

  // Get the options for the current question or set to an empty array
  const selectedOptions = answers[currentQuestion.key] || [];

  // Check if the previous button should be disabled
  // Sets to TRUE if on the first question
  const isPrevDisabled = currentStep === 0;

  // Check if the next button should be disabled
  // Sets to TRUE if last question or if no options have been selected for the current question
  const isNextDisabled =
    currentStep === questions.length - 1 || selectedOptions.length === 0;

  // Boolean to check if the last question is reached
  const isLastStep = currentStep === questions.length - 1;
  const isSubmitDisabled = selectedOptions.length === 0;

  return (
    <div className="flex flex-col p-5 lg:mx-auto xl:w-1/2">
      <h2 className="text-primary mb-10 text-3xl font-semibold">
        {currentQuestion.question}
      </h2>
      <div className="grid grid-cols-2 justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-4">
        {currentQuestion.options.map((option) => {
          const isSelected = (answers[currentQuestion.key] || []).includes(
            option.id,
          );
          return (
            <div
              key={option.id}
              className={`text-light outline-accent flex h-[150px] w-full cursor-pointer items-center justify-center rounded-2xl text-center text-xl font-semibold transition-all duration-200 ease-in-out active:scale-95 ${
                isSelected
                  ? "bg-primary ring-accent scale-105 shadow-2xl hover:scale-[1.08]"
                  : "bg-secondary hover:bg-lighterSecondary hover:scale-105 hover:shadow-xl"
              }`}
              onClick={() => handleSelect(currentQuestion.key, option.id)}
            >
              {option.name}
            </div>
          );
        })}
      </div>
      <div className="my-24 flex justify-end gap-2">
        <button
          onClick={handlePrev}
          disabled={isPrevDisabled}
          className="bg-secondary text-light hover:bg-lighterSecondary w-[80px] cursor-pointer rounded p-2 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-gray-200"
        >
          Go Back
        </button>
        {isLastStep ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="bg-primary text-light hover:bg-darkerPrimary w-[80px] cursor-pointer rounded p-2 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="bg-primary text-light hover:bg-darkerPrimary w-[80px] cursor-pointer rounded p-2 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
export default Questionnaire;
