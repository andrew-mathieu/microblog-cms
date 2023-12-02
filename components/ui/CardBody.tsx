import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  styling?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Ajoutez cette ligne
}

const CardBody = ({ children, styling, onClick }: Props) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`card rounded-3xl p-8 text-black shadow-2xl md:max-w-lg`}
      style={styling}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default CardBody;
