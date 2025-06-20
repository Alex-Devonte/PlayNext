import { useLocation } from "react-router-dom";

function GameDetail() {
  const location = useLocation();
  console.log("GameDetail location state:", location.state.id);
  return (
    <div>
      <h1>Game Detail</h1>
      <p>This is the game detail page.</p>
    </div>
  );
}
export default GameDetail;
