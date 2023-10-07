import Link from "next/link";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import Button from "./Button";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import { AiOutlineLink } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface CardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  uid?: string | number;
  content: string;
  date: string;
  delete?: boolean;
  deleteFn?: () => void;
  shareable?: boolean;
}

export default function Card(props: CardProps) {
  const [value, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(`${window.location.origin}/post/${props.uid}`);
    toast.dark("Copié dans le presse-papier", {
      position: "bottom-right",
      type: "default",
      className: "p-8 bg-gray-800 text-white font-medium rounded-xl",
      progressClassName: "hidden",
    });
  };

  return (
    <>
      <CardBody>
        {props.delete && (
          <Button onClick={props.deleteFn} value={"Supprimer"} />
        )}
        <CardHeader content={props.content} />
        {props.shareable && (
          <Button
            onClick={handleCopy}
            className={
              "absolute right-8 top-1/2 -translate-y-1/2 transform opacity-50 hover:opacity-100"
            }
            value={<AiOutlineLink />}
          />
        )}
        <CardFooter date={props.date} />
      </CardBody>
      <ToastContainer />
    </>
  );
}
