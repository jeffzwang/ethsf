const ChunkyButton = ({
  title,
  className = '',
  onClick,
}: {
  title: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={() => {
        onClick ? onClick() : null;
      }}
      className={`
      font-mono
      bg-aqua
      text-eggshell
      py-3
      px-4
      rounded
      font-bold
      shadow-[0px_3px_6px_rgba(146,151,160,0.52)]
      shadow-[inset_0px_3px_7px_#436AEA]
      hover:opacity-80 
       ${className}`}>
      {title}
    </button>
  );
};

export default ChunkyButton;
