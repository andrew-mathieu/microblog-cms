import { IoClose } from "react-icons/io5";

type Props = {
  content: string;
  date: string;
  close: () => void;
};
export default function Modal({ content, date, close }: Props) {
  const userLang = navigator.language;

  const formattedDate = new Date(date).toLocaleDateString(userLang, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h12",
  });
  return (
    <div
      className={
        "fixed z-[999999] grid h-screen w-full place-items-center bg-black bg-opacity-40 backdrop-blur"
      }
    >
      <div
        className={
          "relative rounded-3xl bg-[#251919] p-16 text-[#FF9595] shadow-2xl md:max-w-4xl"
        }
      >
        <span
          className="absolute right-0 top-0 m-6 cursor-pointer rounded-full p-2"
          onClick={close}
        >
          <IoClose />
        </span>
        <p className="flex h-auto overflow-hidden overflow-ellipsis whitespace-pre-line text-3xl font-medium leading-snug">
          {content}
        </p>
        <div className="mt-4 flex justify-end font-medium">{formattedDate}</div>
      </div>
    </div>
  );
}
