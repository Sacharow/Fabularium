import type { ButtonHTMLAttributes, ReactNode } from "react";

type PreviewActionButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface PreviewActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PreviewActionButtonVariant;
  icon?: ReactNode;
}

const variantClasses: Record<PreviewActionButtonVariant, string> = {
  primary:
    "border-2 border-gold-neutral bg-neutral text-neutral-text hover:bg-gold-neutral",
  secondary:
    "border-2 border-gold-neutral bg-neutral text-neutral-text hover:bg-gold-neutral",
  danger: "border-2 border-error bg-neutral text-neutral-text hover:bg-error",
  ghost:
    "border-2 border-gold-neutral bg-neutral text-neutral-text hover:bg-gold-neutral",
};

export function PreviewActionButton({
  variant = "primary",
  icon,
  className = "",
  children,
  type = "button",
  ...props
}: PreviewActionButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 px-3 py-2 font-semibold cursor-pointer ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
