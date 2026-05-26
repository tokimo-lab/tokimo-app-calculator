import type { CalculatorState } from "../calculator-engine";

interface ScientificKeypadProps {
  state: CalculatorState;
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onScientific: (fn: string) => void;
  onAngleToggle: () => void;
  onMemory: (action: string) => void;
  onBackspace: () => void;
}

/** Small button for the scientific function rows */
function SciBtn({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg font-normal text-[0.7rem] transition-all duration-100 flex items-center justify-center ${
        active
          ? "bg-white/90 text-[#ff9f0a]"
          : "bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

export default function ScientificKeypad({
  state,
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onToggleSign,
  onPercent,
  onScientific,
  onAngleToggle,
  onMemory,
  onBackspace,
}: ScientificKeypadProps) {
  return (
    <div className="flex flex-col gap-[6px] h-full">
      {/* ── Scientific function rows (compact, 5 cols) ── */}
      <div
        className="grid grid-cols-5 gap-[5px] flex-shrink-0"
        style={{ gridAutoRows: "28px" }}
      >
        {/* Row 1: Memory */}
        <SciBtn label="MC" onClick={() => onMemory("MC")} />
        <SciBtn label="MR" onClick={() => onMemory("MR")} />
        <SciBtn label="M+" onClick={() => onMemory("M+")} />
        <SciBtn label="MS" onClick={() => onMemory("MS")} />
        <SciBtn
          label={state.angleUnit === "deg" ? "Deg" : "Rad"}
          onClick={onAngleToggle}
          active
        />

        {/* Row 2 */}
        <SciBtn label="x²" onClick={() => onScientific("x2")} />
        <SciBtn label="x³" onClick={() => onScientific("x3")} />
        <SciBtn label="√x" onClick={() => onScientific("sqrt")} />
        <SciBtn label="∛x" onClick={() => onScientific("cbrt")} />
        <SciBtn label="x!" onClick={() => onScientific("x!")} />

        {/* Row 3: Trig */}
        <SciBtn label="sin" onClick={() => onScientific("sin")} />
        <SciBtn label="cos" onClick={() => onScientific("cos")} />
        <SciBtn label="tan" onClick={() => onScientific("tan")} />
        <SciBtn label="ln" onClick={() => onScientific("ln")} />
        <SciBtn label="log₁₀" onClick={() => onScientific("log")} />

        {/* Row 4: Inverse trig + exp */}
        <SciBtn label="sin⁻¹" onClick={() => onScientific("asin")} />
        <SciBtn label="cos⁻¹" onClick={() => onScientific("acos")} />
        <SciBtn label="tan⁻¹" onClick={() => onScientific("atan")} />
        <SciBtn label="eˣ" onClick={() => onScientific("exp")} />
        <SciBtn label="10ˣ" onClick={() => onScientific("pow10")} />

        {/* Row 5: Constants + misc */}
        <SciBtn label="π" onClick={() => onScientific("pi")} />
        <SciBtn label="e" onClick={() => onScientific("e")} />
        <SciBtn label="1/x" onClick={() => onScientific("1/x")} />
        <SciBtn label="|x|" onClick={() => onScientific("abs")} />
        <SciBtn label="⌫" onClick={onBackspace} />
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-[#38383a] flex-shrink-0" />

      {/* ── Standard keypad (same as basic, 4 cols) ── */}
      <div className="grid grid-cols-4 gap-[8px] flex-1">
        <SmallCalcBtn label="AC" onClick={onClear} variant="function" />
        <SmallCalcBtn label="+/−" onClick={onToggleSign} variant="function" />
        <SmallCalcBtn label="%" onClick={onPercent} variant="function" />
        <SmallCalcBtn
          label="÷"
          onClick={() => onOperator("÷")}
          variant="operator"
        />

        <SmallCalcBtn label="7" onClick={() => onDigit("7")} />
        <SmallCalcBtn label="8" onClick={() => onDigit("8")} />
        <SmallCalcBtn label="9" onClick={() => onDigit("9")} />
        <SmallCalcBtn
          label="×"
          onClick={() => onOperator("×")}
          variant="operator"
        />

        <SmallCalcBtn label="4" onClick={() => onDigit("4")} />
        <SmallCalcBtn label="5" onClick={() => onDigit("5")} />
        <SmallCalcBtn label="6" onClick={() => onDigit("6")} />
        <SmallCalcBtn
          label="−"
          onClick={() => onOperator("-")}
          variant="operator"
        />

        <SmallCalcBtn label="1" onClick={() => onDigit("1")} />
        <SmallCalcBtn label="2" onClick={() => onDigit("2")} />
        <SmallCalcBtn label="3" onClick={() => onDigit("3")} />
        <SmallCalcBtn
          label="+"
          onClick={() => onOperator("+")}
          variant="operator"
        />

        <SmallCalcBtn label="0" onClick={() => onDigit("0")} span />
        <SmallCalcBtn label="." onClick={() => onDigit(".")} />
        <SmallCalcBtn label="=" onClick={onEquals} variant="equals" />
      </div>
    </div>
  );
}

/** Smaller calc button for scientific mode to fit both sections */
function SmallCalcBtn({
  label,
  onClick,
  variant = "digit",
  span,
}: {
  label: string;
  onClick: () => void;
  variant?: "digit" | "operator" | "function" | "equals";
  span?: boolean;
}) {
  const styles = {
    digit: "bg-white/20 hover:bg-white/30 active:bg-white/40 text-white",
    operator:
      "bg-[#ff9f0a]/80 hover:bg-[#ff9f0a]/90 active:bg-[#ff9f0a] text-white text-[1.15rem]",
    function: "bg-white/40 hover:bg-white/55 active:bg-white/65 text-black/80",
    equals:
      "bg-[#ff9f0a]/80 hover:bg-[#ff9f0a]/90 active:bg-[#ff9f0a] text-white text-[1.15rem]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles[variant]} rounded-full font-normal text-[1rem] transition-all duration-100 flex items-center justify-center ${
        span ? "col-span-2 px-5 justify-start" : ""
      }`}
    >
      {label}
    </button>
  );
}
