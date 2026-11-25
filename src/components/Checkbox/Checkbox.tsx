import clsx from "clsx"
import type { InputHTMLAttributes } from "react"
import "./Checkbox.scss"

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">

export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <input type="checkbox" className={clsx("checkbox", className)} {...props} />
)
