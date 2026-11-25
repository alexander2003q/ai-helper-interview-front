import clsx from "clsx"
import type { TextareaHTMLAttributes } from "react"
import "./Textarea.scss"

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea className={clsx("textarea", className)} {...props} />
)
