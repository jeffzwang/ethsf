const RedButton = ({
  onClick,
  title,
}: {
  onClick: () => void,
  title: string,
}) => {
  return (
    <button
      onClick={onClick}
      className="
      hover:opacity-80
      py-1 
      px-2
      rounded
      font-mono
      font-semibold
      text-eggshell
      border-rose-500
      bg-rose-500
      shadow-[0px_2px_4px_rgba(244,63,94,0.52)]
      shadow-[inset_0px_3px_7px_#f43f5e]
      ">
      {title}
    </button>
  )

}

export default RedButton;