const CardBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={
        "card relative h-full rounded-xl  border border-zinc-900 bg-zinc-950 p-8"
      }
    >
      {children}
    </div>
  );
};

export default CardBody;
