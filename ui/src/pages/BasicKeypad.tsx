import CalcButton from "./CalcButton";

interface BasicKeypadProps {
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onBackspace: () => void;
}

export default function BasicKeypad({
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onToggleSign,
  onPercent,
  onBackspace,
}: BasicKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-[10px] h-full">
      {/* Row 1: Light gray function row — macOS style */}
      <CalcButton label="AC" onClick={onClear} variant="function" />
      <CalcButton label="+/−" onClick={onToggleSign} variant="function" />
      <CalcButton label="%" onClick={onPercent} variant="function" />
      <CalcButton
        label="÷"
        onClick={() => onOperator("÷")}
        variant="operator"
      />

      {/* Row 2 */}
      <CalcButton label="7" onClick={() => onDigit("7")} />
      <CalcButton label="8" onClick={() => onDigit("8")} />
      <CalcButton label="9" onClick={() => onDigit("9")} />
      <CalcButton
        label="×"
        onClick={() => onOperator("×")}
        variant="operator"
      />

      {/* Row 3 */}
      <CalcButton label="4" onClick={() => onDigit("4")} />
      <CalcButton label="5" onClick={() => onDigit("5")} />
      <CalcButton label="6" onClick={() => onDigit("6")} />
      <CalcButton
        label="−"
        onClick={() => onOperator("-")}
        variant="operator"
      />

      {/* Row 4 */}
      <CalcButton label="1" onClick={() => onDigit("1")} />
      <CalcButton label="2" onClick={() => onDigit("2")} />
      <CalcButton label="3" onClick={() => onDigit("3")} />
      <CalcButton
        label="+"
        onClick={() => onOperator("+")}
        variant="operator"
      />

      {/* Row 5 — "0" spans 2 columns */}
      <CalcButton label="0" onClick={() => onDigit("0")} span={2} />
      <CalcButton label="." onClick={() => onDigit(".")} />
      <CalcButton label="=" onClick={onEquals} variant="equals" />

      {/* Hidden accessibility backspace */}
      <button
        type="button"
        onClick={onBackspace}
        className="sr-only"
        aria-label="Backspace"
      />
    </div>
  );
}
