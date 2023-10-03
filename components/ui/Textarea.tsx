import React from "react";

export interface TextareaProps
  extends React.ButtonHTMLAttributes<HTMLTextAreaElement> {
  value: string | undefined;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <textarea className={`${className}`} ref={ref} {...props} value={value} />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
