interface gameCardProps {
  name: string;
  coverUrl: string;
  summary: string;
}

const GameCard: React.FC<gameCardProps> = ({ name, coverUrl, summary }) => {
  return (
    <div className="flex h-[350px] w-[350px] flex-col rounded-2xl border lg:w-full">
      <div className="relative h-full w-full overflow-hidden rounded-t-2xl">
        <img
          src={coverUrl.replace("t_thumb", "t_screenshot_med")}
          alt={`${name} cover`}
          className="absolute inset-0 h-full w-full rounded-t-2xl object-cover"
        />
      </div>
      <div className="flex h-[150px] items-center rounded-b-2xl bg-gray-800 p-2 text-white">
        <h2 className="text-2xl font-bold">{name}</h2>
        {/* <p>{summary}</p> */}
      </div>
    </div>
  );
};

export default GameCard;
