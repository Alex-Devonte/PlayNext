interface gameCardProps {
  name: string;
  coverUrl: string;
  summary: string;
}

const GameCard: React.FC<gameCardProps> = ({ name, coverUrl, summary }) => {
  return (
    <div className="border">
      <h2>{name}</h2>
      <img src={coverUrl} alt={`${name} cover`} />
      <p>{summary}</p>
    </div>
  );
};

export default GameCard;
