import type { ReactNode, SVGProps } from "react"

export type IconName =
  | "sparkles"
  | "chevron-right"
  | "chevron-down"
  | "message"
  | "microphone"
  | "settings"
  | "search"
  | "close"
  | "minus"
  | "plus"
  | "check"
  | "bulb"
  | "play"

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

export const Icon = ({ name, size = 20, ...props }: IconProps) => {
  const content: Record<IconName, ReactNode> = {
    sparkles: (
      <>
        <path
          d="M11.6 2.8c.4 4.6 3.2 7.4 7.8 7.8-4.6.4-7.4 3.2-7.8 7.8-.4-4.6-3.2-7.4-7.8-7.8 4.6-.4 7.4-3.2 7.8-7.8Z"
          fill="currentColor"
        />
        <path
          d="M19.1 2.5c.1 1.3.9 2.1 2.2 2.2-1.3.1-2.1.9-2.2 2.2-.1-1.3-.9-2.1-2.2-2.2 1.3-.1 2.1-.9 2.2-2.2Z"
          fill="currentColor"
        />
      </>
    ),
    "chevron-right": (
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    "chevron-down": (
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    message: (
      <>
        <rect
          x="4"
          y="5"
          width="16"
          height="13"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="m8 18-2.8 2.1.7-3.6M8 10h8M8 13h5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    microphone: (
      <>
        <rect
          x="9"
          y="3"
          width="6"
          height="11"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M6 11.5v.5a6 6 0 0 0 12 0v-.5M12 18v3M9.5 21h5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M19 13.6v-3.2l-2-.6-.5-1.3 1-1.8-2.2-2.2-1.8 1-1.3-.5-.6-2H8.4l-.6 2-1.3.5-1.8-1-2.2 2.2 1 1.8-.5 1.3-2 .6v3.2l2 .6.5 1.3-1 1.8 2.2 2.2 1.8-1 1.3.5.6 2h3.2l.6-2 1.3-.5 1.8 1 2.2-2.2-1-1.8.5-1.3 2-.6Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </>
    ),
    search: (
      <>
        <circle
          cx="10.5"
          cy="10.5"
          r="6"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m15.5 15.5 4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
    close: (
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    minus: (
      <path
        d="M7 12h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    plus: (
      <path
        d="M12 7v10M7 12h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    check: (
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    bulb: (
      <>
        <path
          d="M8.5 15.5c-1.5-1.1-2.5-2.9-2.5-5a6 6 0 1 1 12 0c0 2.1-1 3.9-2.5 5-.7.5-1 1.2-1 2h-5c0-.8-.3-1.5-1-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M9.5 21h5M9.5 18h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
    play: <path d="m9 6 9 6-9 6V6Z" fill="currentColor" />,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {content[name]}
    </svg>
  )
}
