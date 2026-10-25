import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "neon" | "ghost";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  neon: "btn-neon",
  ghost: "btn-ghost",
};

function Button({
  variant = "neon",
  className = "",
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

function LinkButton({
  variant = "neon",
  className = "",
  href,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

export { Button, LinkButton };
