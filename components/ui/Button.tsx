import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string | any; // Ajout de la propriété value
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <button className={`${className}`} ref={ref} {...props}>
        {value}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
