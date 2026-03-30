import type { CalculatorState } from "../calculator-engine";
import CalcButton from "./CalcButton";

interface ProgrammerKeypadProps {
  state: CalculatorState;
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBitwise: (fn: string) => void;
  onBaseChange: (base: 10 | 16 | 8 | 2) => void;
  onBackspace: () => void;
}

const BASES: { label: string; value: 10 | 16 | 8 | 2 }[] = [
  { label: "HEX", value: 16 },
  { label: "DEC", value: 10 },
  { label: "OCT", value: 8 },
  { label: "BIN", value: 2 },
];

export default function ProgrammerKeypad({
  state,
  onDigit,
  onOperator,
  onEquals,
  onClear,
  onBitwise,
  onBaseChange,
  onBackspace,
}: ProgrammerKeypadProps) {
  const isHexEnabled = state.base >= 16;

  const isDigitEnabled = (d: number) => {
    if (state.base === 2) return d < 2;
    if (state.base === 8) return d < 8;
    return true;
  };

  return (
    <div className="flex flex-col gap-[6px] h-full">
      {/* ── Base selector row ── */}
      <div className="flex gap-[5px] flex-shrink-0 h-7">
        {BASES.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() => onBaseChange(b.value)}
            className={`flex-1 rounded-lg text-[0.7rem] font-medium transition-all duration-100 ${
              state.base === b.value
                ? "bg-[#ff9f0a]/80 text-white"
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* ── Bitwise function row ── */}
      <div className="grid grid-cols-5 gap-[5px] flex-shrink-0 h-7">
        <BitBtn label="AND" onClick={() => onOperator("AND")} />
        <BitBtn label="OR" onClick={() => onOperator("OR")} />
        <BitBtn label="XOR" onClick={() => onOperator("XOR")} />
        <BitBtn label="NOT" onClick={() => onBitwise("NOT")} />
        <BitBtn label="⌫" onClick={onBackspace} />
      </div>

      <div className="grid grid-cols-5 gap-[5px] flex-shrink-0 h-7">
        <BitBtn label="≪" onClick={() => onBitwise("<<")} />
        <BitBtn label="≫" onClick={() => onBitwise(">>")} />
        <HexBtn label="A" onClick={() => onDigit("a")} enabled={isHexEnabled} />
        <HexBtn label="B" onClick={() => onDigit("b")} enabled={isHexEnabled} />
        <BitBtn label="AC" onClick={onClear} />
      </div>

      <div className="grid grid-cols-5 gap-[5px] flex-shrink-0 h-7">
        <HexBtn label="C" onClick={() => onDigit("c")} enabled={isHexEnabled} />
        <HexBtn label="D" onClick={() => onDigit("d")} enabled={isHexEnabled} />
        <HexBtn label="E" onClick={() => onDigit("e")} enabled={isHexEnabled} />
        <HexBtn label="F" onClick={() => onDigit("f")} enabled={isHexEnabled} />
        <BitBtn
          label="FF"
          onClick={() => {
            onDigit("f");
            onDigit("f");
          }}
        />
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-[#38383a] flex-shrink-0" />

      {/* ── Standard digit grid ── */}
      <div className="grid grid-cols-4 gap-[8px] flex-1">
        {["7", "8", "9"].map((d) => (
          <CalcButton
            key={d}
            label={d}
            onClick={() => onDigit(d)}
            disabled={!isDigitEnabled(Number(d))}
          />
        ))}
        <CalcButton
          label="÷"
          onClick={() => onOperator("÷")}
          variant="operator"
        />

        {["4", "5", "6"].map((d) => (
          <CalcButton
            key={d}
            label={d}
            onClick={() => onDigit(d)}
            disabled={!isDigitEnabled(Number(d))}
          />
        ))}
        <CalcButton
          label="×"
          onClick={() => onOperator("×")}
          variant="operator"
        />

        {["1", "2", "3"].map((d) => (
          <CalcButton
            key={d}
            label={d}
            onClick={() => onDigit(d)}
            disabled={!isDigitEnabled(Number(d))}
          />
        ))}
        <CalcButton
          label="−"
          onClick={() => onOperator("-")}
          variant="operator"
        />

        <CalcButton label="0" onClick={() => onDigit("0")} span={2} />
        <CalcButton label="=" onClick={onEquals} variant="equals" />
        <CalcButton
          label="+"
          onClick={() => onOperator("+")}
          variant="operator"
        />
      </div>
    </div>
  );
}

function BitBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg font-normal text-[0.7rem] bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 transition-all duration-100 flex items-center justify-center"
    >
      {label}
    </button>
  );
}

function HexBtn({
  label,
  onClick,
  enabled,
}: {
  label: string;
  onClick: () => void;
  enabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      className={`rounded-lg font-normal text-[0.7rem] transition-all duration-100 flex items-center justify-center ${
        enabled
          ? "bg-white/15 hover:bg-white/25 active:bg-white/35 text-white/80"
          : "bg-white/5 text-white/20 cursor-not-allowed"
      }`}
    >
      {label}
    </button>
  );
}
