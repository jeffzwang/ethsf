const GreenButton = ({
  onClick,
  children,
  className = '',

}: {
  onClick: () => void,
  className?: string;

  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        py-1 
        px-2
        rounded
        font-mono
        font-semibold
        hover:opacity-80
        text-eggshell
        border-forest
        bg-forest
        shadow-[0px_2px_4px_rgba(146,151,160,0.52)]
        shadow-[inset_0px_3px_7px_#48945A]
        ${className}
        `}>
      {children}
    </button>
  )

}

export default GreenButton;