import clsx from "clsx"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import "./Button.scss"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost"
  startIcon?: ReactNode
  icon?: ReactNode
}

export const Button = ({
  variant = "primary",
  className,
  children,
  startIcon,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx("button", `button--${variant}`, className)}
      {...props}
    >
      {startIcon}
      <span className="button__label">{children}</span>
      {icon}
    </button>
  )
}
