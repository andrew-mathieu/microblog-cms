import { useState } from "react";

const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const duration = {
    autoClose: 3000,
  };

  return (
    <div
      className={
        "card absolute bottom-0 right-0  h-full rounded-xl border border-zinc-900 bg-zinc-950 p-8"
      }
    >
      {children}
    </div>
  );
};
