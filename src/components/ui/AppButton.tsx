import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/cn";

type ButtonMotion = "lift" | "nav" | "icon" | "card" | "none";

export interface AppButtonProps extends HTMLMotionProps<"button"> {
  active?: boolean;
  buttonMotion?: ButtonMotion;
}

const BUTTON_MOTION_PROPS: Record<
  ButtonMotion,
  Pick<HTMLMotionProps<"button">, "whileHover" | "whileTap" | "transition">
> = {
  lift: {
    whileHover: { y: -2, scale: 1.01 },
    whileTap: { y: 0, scale: 0.985 },
    transition: { type: "spring", stiffness: 380, damping: 24 },
  },
  nav: {
    whileHover: { y: -1 },
    whileTap: { y: 0, scale: 0.98 },
    transition: { type: "spring", stiffness: 420, damping: 28 },
  },
  icon: {
    whileHover: { y: -1, scale: 1.05 },
    whileTap: { scale: 0.94 },
    transition: { type: "spring", stiffness: 420, damping: 24 },
  },
  card: {
    whileHover: { y: -4, scale: 1.01 },
    whileTap: { y: 0, scale: 0.99 },
    transition: { type: "spring", stiffness: 340, damping: 24 },
  },
  none: {
    transition: { type: "spring", stiffness: 420, damping: 28 },
  },
};

const BUTTON_MOTION_CLASSES: Record<ButtonMotion, string> = {
  lift:
    "relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 disabled:cursor-not-allowed",
  nav:
    "relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:content-[''] after:transition-transform after:duration-300 hover:after:scale-x-100 disabled:cursor-not-allowed",
  icon:
    "relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:bg-current before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-[0.08] disabled:cursor-not-allowed",
  card:
    "relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:bg-[linear-gradient(135deg,rgba(197,160,89,0.14),transparent_55%,rgba(255,255,255,0.08))] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 disabled:cursor-not-allowed",
  none:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-church-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed",
};

export default function AppButton({
  active = false,
  buttonMotion = "lift",
  className,
  disabled,
  type,
  children,
  whileHover,
  whileTap,
  transition,
  ...props
}: AppButtonProps) {
  const motionProps = disabled
    ? {}
    : {
        whileHover: whileHover ?? BUTTON_MOTION_PROPS[buttonMotion].whileHover,
        whileTap: whileTap ?? BUTTON_MOTION_PROPS[buttonMotion].whileTap,
        transition: transition ?? BUTTON_MOTION_PROPS[buttonMotion].transition,
      };

  return (
    <motion.button
      type={type ?? "button"}
      disabled={disabled}
      className={cn(
        "transition-[transform,box-shadow,background-color,color,border-color,opacity] duration-300 ease-out disabled:opacity-70",
        BUTTON_MOTION_CLASSES[buttonMotion],
        buttonMotion === "nav" && active && "after:scale-x-100",
        className,
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
