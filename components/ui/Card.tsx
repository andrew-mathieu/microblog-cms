import Link from "next/link";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import Button from "./Button";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import { AiOutlineLink } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

export interface CardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  uid?: string | number;
  content: string;
  date: string;
  delete?: boolean;
  deleteFn?: () => void;
  modal?: () => void;
  styling?: React.CSSProperties;
}

export default function Card(props: CardProps) {
  const handleClick = () => {
    props.modal && props.modal();
  };
  return (
    <CardBody styling={props.styling} onClick={handleClick}>
      <CardHeader content={props.content} date={props.date} />
      <CardFooter date={props.date} />
      {props.delete && (
        <div className="flex justify-end pb-4">
          <Button
            onClick={props.deleteFn}
            value={<BiTrash />}
            className="flex items-center gap-2 rounded-xl bg-fuchsia-200 p-4 text-darkBlue transition-all hover:scale-110"
          />
        </div>
      )}
    </CardBody>
  );
}
