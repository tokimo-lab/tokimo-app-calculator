interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: "digit" | "operator" | "function" | "equals" | "active";
  span?: number;
  fontSize?: string;
  disabled?: boolean;
}

const VARIANT_STYLES = {
  digit: "bg-white/20 hover:bg-white/30 active:bg-white/40 text-white",
  operator:
    "bg-[#ff9f0a]/80 hover:bg-[#ff9f0a]/90 active:bg-[#ff9f0a] text-white",
  function: "bg-white/40 hover:bg-white/55 active:bg-white/65 text-black/80",
  equals:
    "bg-[#ff9f0a]/80 hover:bg-[#ff9f0a]/90 active:bg-[#ff9f0a] text-white",
  active: "bg-white/90 text-[#ff9f0a]",
};

const DISABLED_STYLE = "bg-white/5 text-white/20 cursor-not-allowed";

export default function CalcButton({
  label,
  onClick,
  variant = "digit",
  span = 1,
  fontSize,
  disabled = false,
}: CalcButtonProps) {
  const sizeClass =
    fontSize ??
    (variant === "operator" || variant === "equals"
      ? "text-[1.6rem]"
      : "text-[1.25rem]");

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${disabled ? DISABLED_STYLE : VARIANT_STYLES[variant]} rounded-full font-normal transition-all duration-100 flex items-center justify-center ${sizeClass} ${
        span > 1 ? "col-span-2 px-7 justify-start" : ""
      }`}
    >
      {label}
    </button>
  );
}
