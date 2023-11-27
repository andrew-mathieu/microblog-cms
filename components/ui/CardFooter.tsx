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
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h12",
  });

  return (
    <div className={"card-footer mt-4 flex w-full justify-end"}>
      <span className="text-right text-sm opacity-50">{formattedDate}</span>
    </div>
  );
};

export default CardFooter;
