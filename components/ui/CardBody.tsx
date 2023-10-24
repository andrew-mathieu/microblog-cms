interface Props extends React.AllHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  styling?: React.CSSProperties;
}

const CardBody = ({ children, styling }: Props) => {
  return (
    <div
      className={`card w-full rounded-3xl p-8 text-black shadow-2xl md:max-w-lg`}
      style={styling}
    >
      {children}
    </div>
  );
};

export default CardBody;
