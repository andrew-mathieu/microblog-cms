import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string | undefined;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <textarea
        className={`${className}`}
        ref={ref}
        {...props}
        value={value}
        maxLength={2048}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
