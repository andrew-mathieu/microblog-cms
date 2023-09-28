const CardBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={
        'card p-8 rounded-xl bg-zinc-950  border-zinc-900 hover:border-zinc-800 border transition-colors h-full relative'
      }
    >
      {children}
    </div>
  );
};

export default CardBody;
