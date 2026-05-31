import React from "react";

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95";

  const variants = {
    default: "bg-white text-slate-950 hover:bg-slate-200 shadow-md shadow-white/5",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/10",
    outline: "border border-white/10 bg-transparent text-slate-100 hover:bg-white/5",
    ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <button
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
