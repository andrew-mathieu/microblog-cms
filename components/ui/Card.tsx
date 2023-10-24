import Link from "next/link";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import Button from "./Button";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import { AiOutlineLink } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface CardProps extends React.AllHTMLAttributes<HTMLDivElement> {
  uid?: string | number;
  content: string;
  date: string;
  delete?: boolean;
  deleteFn?: () => void;
  styling?: React.CSSProperties;
}

export default function Card(props: CardProps) {
  return (
    <CardBody styling={props.styling}>
      {props.delete && <Button onClick={props.deleteFn} value={"Supprimer"} />}
      <CardHeader content={props.content} date={props.date} />
    </CardBody>
  );
}
