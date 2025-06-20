import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questionnaire" element={<div>Questionnaire Page</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
