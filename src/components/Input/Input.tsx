import clsx from "clsx"
import type { InputHTMLAttributes } from "react"
import "./Input.scss"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "default" | "bare"
}

export const Input = ({
  variant = "default",
  className,
  ...props
}: InputProps) => (
  <input className={clsx("input", `input--${variant}`, className)} {...props} />
)
