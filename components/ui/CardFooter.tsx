import React from "react";

type CardFooterProps = {
  date: string;
};

const CardFooter = (props: CardFooterProps) => {
  const userLang = navigator.language;

  const formattedDate = new Date(props.date).toLocaleDateString(userLang, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className={"card-footer"}>
      <span className="text-sm opacity-25"></span>
    </div>
  );
};

export default CardFooter;
