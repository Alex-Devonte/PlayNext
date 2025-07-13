import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import GameDetail from "./components/GameDetail";
import Questionnaire from "./components/Questionnaire";
import Results from "./components/Results";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
