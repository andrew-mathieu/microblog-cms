import Button from './Button';

interface CardHeaderProps {
  content: string | TrustedHTML;
}

const CardHeader = (props: CardHeaderProps) => {
  return (
    <div className={'card-header flex flex-col gap-4'}>
      <div
        className={
          'card-title overflow-hidden overflow-ellipsis text-2xl whitespace-nowrap font-semibold'
        }
      >
        <div dangerouslySetInnerHTML={{ __html: props.content }} />
      </div>
    </div>
  );
};

export default CardHeader;
