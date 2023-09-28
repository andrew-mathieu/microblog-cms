import React from 'react';

type CardFooterProps = {
  date: string;
};

const CardFooter = (props: CardFooterProps) => {
  const userLang = navigator.language;

  const formattedDate = new Date(props.date).toLocaleDateString(userLang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={'card-footer'}>
      <span className="text-sm opacity-25">
        {userLang.startsWith('fr')
          ? `Publié le ${formattedDate}`
          : userLang.startsWith('es')
          ? `Publicado el ${formattedDate}`
          : userLang.startsWith('de')
          ? `Veröffentlicht am ${formattedDate}`
          : userLang.startsWith('it')
          ? `Pubblicato il ${formattedDate}`
          : userLang.startsWith('pt')
          ? `Publicado em ${formattedDate}`
          : userLang.startsWith('ru')
          ? `Опубликовано ${formattedDate}`
          : userLang.startsWith('zh')
          ? `發布於 ${formattedDate}`
          : userLang.startsWith('ja')
          ? `に公開 ${formattedDate}`
          : `Published on ${formattedDate}`}
      </span>
    </div>
  );
};

export default CardFooter;
