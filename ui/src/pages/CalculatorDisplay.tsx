import type { CalculatorState } from "../calculator-engine";

interface CalculatorDisplayProps {
  state: CalculatorState;
}

export default function CalculatorDisplay({ state }: CalculatorDisplayProps) {
  // macOS calculator shrinks text as the number gets longer
  const len = state.display.length;
  const fontSize =
    len > 14
      ? "text-[1.5rem]"
      : len > 11
        ? "text-[2rem]"
        : len > 8
          ? "text-[2.5rem]"
          : "text-[3.2rem]";

  return (
    <div className="flex flex-col items-end px-6 pt-1 pb-3 min-h-[100px] justify-end">
      {/* Expression preview */}
      {state.expression ? (
        <div className="text-[0.8rem] text-[#8e8e93] truncate w-full text-right mb-0.5 font-light tabular-nums">
          {state.expression}
        </div>
      ) : null}

      {/* Main display — large, right-aligned, light weight like macOS */}
      <div
        className={`${fontSize} font-extralight text-white w-full text-right truncate leading-tight tabular-nums tracking-tight`}
      >
        {formatDisplay(state.display)}
      </div>

      {/* Subtle mode indicators */}
      {(state.memory !== 0 ||
        state.mode === "scientific" ||
        state.mode === "programmer") && (
        <div className="flex gap-2.5 mt-1.5 text-[0.65rem] text-[#636366] font-medium tracking-wide uppercase">
          {state.mode === "scientific" && <span>{state.angleUnit}</span>}
          {state.mode === "programmer" && <span>Base {state.base}</span>}
          {state.memory !== 0 && <span>M</span>}
        </div>
      )}
    </div>
  );
}

/** Add thousand separators for readability (macOS style) */
function formatDisplay(display: string): string {
  if (display === "Error") return display;

  const negative = display.startsWith("-");
  const abs = negative ? display.slice(1) : display;
  const [intPart, decPart] = abs.split(".");

  // Only format if it's a pure integer part (not scientific notation)
  if (/^\d+$/.test(intPart) && intPart.length > 3) {
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const result =
      decPart !== undefined ? `${formatted}.${decPart}` : formatted;
    return negative ? `-${result}` : result;
  }

  return display;
}
