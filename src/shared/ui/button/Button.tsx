import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "text" | "nav" | "brand" | "card";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type LinkButtonProps = SharedProps &
  { as: "link" } & Omit<ComponentProps<typeof Link>, "as" | "children" | "className">;

type AnchorButtonProps = SharedProps &
  { as: "a" } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className">;

type NativeButtonProps = SharedProps &
  { as?: "button" } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

export type ButtonProps = LinkButtonProps | AnchorButtonProps | NativeButtonProps;

function combineClasses(variant: ButtonVariant, className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

export function Button(props: ButtonProps) {
  if (props.as === "link") {
    const { as, variant = "primary", className, children, ...linkProps } = props;
    void as;
    return (
      <Link {...linkProps} className={combineClasses(variant, className)}>
        {children}
      </Link>
    );
  }

  if (props.as === "a") {
    const { as, variant = "primary", className, children, ...anchorProps } = props;
    void as;
    return (
      <a {...anchorProps} className={combineClasses(variant, className)}>
        {children}
      </a>
    );
  }

  const { as, variant = "primary", className, children, ...buttonProps } = props;
  void as;
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? "button"}
      className={combineClasses(variant, className)}
    >
      {children}
    </button>
  );
}
