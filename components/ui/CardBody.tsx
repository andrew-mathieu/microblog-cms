type Props = {
  children: React.ReactNode;
};

const CardBody = ({ children }: Props) => {
  return (
    <div
      className={
        "card relative h-full border-b border-l border-r border-stone-800 bg-stone-950 p-8"
      }
    >
      {children}
    </div>
  );
};

export default CardBody;
