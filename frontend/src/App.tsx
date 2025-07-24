import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import GameDetail from "./components/GameDetail";
import Questionnaire from "./components/Questionnaire";
import Results from "./components/Results";
import Header from "./components/Header";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <Router>
      <div className="bg-light flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/game/:id" element={<GameDetail />} />
            <Route path="/results" element={<Results />} />
            <Route path="/404" element={<PageNotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
