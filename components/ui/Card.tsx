import Link from 'next/link';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import Button from './Button';
import { useCopyToClipboard } from '@/lib/useCopyToClipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  uid?: string | number;
  content: string | TrustedHTML;
  date: string;
  delete?: boolean;
  deleteFn?: () => void;
  shareable?: boolean;
};

export default function Card(props: Props) {
  const [value, copy] = useCopyToClipboard();

  const handleCopy = () => {
    copy(`${window.location.origin}/post/${props.uid}`);
    toast.dark('Copié dans le presse-papier', {
      position: 'bottom-right',
      type: 'default',
      className: 'p-8 bg-gray-800 text-white',
      progressClassName: 'hidden',
    });
  };

  return (
    <>
      <CardBody>
        {props.delete && (
          <Button onClick={props.deleteFn} value={'Supprimer'} />
        )}
        <CardHeader content={props.content} />
        {props.shareable && (
          <Button
            onClick={handleCopy}
            className={'absolute top-1/2 right-8 transform -translate-y-1/2'}
            value={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            }
          />
        )}
        <CardFooter date={props.date} />
      </CardBody>
      <ToastContainer />
    </>
  );
}
