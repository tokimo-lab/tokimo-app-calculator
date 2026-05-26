import { useCallback, useState } from "react";
import type { CalculatorMode, CalculatorState } from "../calculator-engine";
import {
  backspace,
  bitwiseFn,
  bitwiseOperator,
  calculateBitwiseResult,
  calculateResult,
  clearAll,
  clearEntry,
  INITIAL_STATE,
  inputDigit,
  inputOperator,
  inputPercent,
  memoryAdd,
  memoryClear,
  memoryRecall,
  memoryStore,
  scientificFn,
  setBase,
  toggleSign,
} from "../calculator-engine";
import BasicKeypad from "./BasicKeypad";
import CalculatorDisplay from "./CalculatorDisplay";
import ProgrammerKeypad from "./ProgrammerKeypad";
import ScientificKeypad from "./ScientificKeypad";

const MODE_LABELS: Record<CalculatorMode, string> = {
  basic: "Basic",
  scientific: "Scientific",
  programmer: "Programmer",
};

const MODES: CalculatorMode[] = ["basic", "scientific", "programmer"];

export default function CalculatorPage() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const handleDigit = useCallback((d: string) => {
    setState((s) => inputDigit(s, d));
  }, []);

  const handleOperator = useCallback((op: string) => {
    setState((s) => {
      if (s.mode === "programmer") return { ...bitwiseOperator(s, op) };
      return inputOperator(s, op);
    });
  }, []);

  const handleEquals = useCallback(() => {
    setState((s) => {
      if (s.mode === "programmer") return calculateBitwiseResult(s);
      return calculateResult(s);
    });
  }, []);

  const handleClear = useCallback(() => {
    setState((s) => clearAll(s));
  }, []);

  const handleClearEntry = useCallback(() => {
    setState((s) => clearEntry(s));
  }, []);

  const handleToggleSign = useCallback(() => {
    setState((s) => toggleSign(s));
  }, []);

  const handlePercent = useCallback(() => {
    setState((s) => inputPercent(s));
  }, []);

  const handleScientific = useCallback((fn: string) => {
    setState((s) => scientificFn(s, fn));
  }, []);

  const handleBitwise = useCallback((fn: string) => {
    setState((s) => bitwiseFn(s, fn));
  }, []);

  const handleBaseChange = useCallback((base: 10 | 16 | 8 | 2) => {
    setState((s) => setBase(s, base));
  }, []);

  const handleMemory = useCallback((action: string) => {
    setState((s) => {
      switch (action) {
        case "MS":
          return memoryStore(s);
        case "MR":
          return memoryRecall(s);
        case "M+":
          return memoryAdd(s);
        case "MC":
          return memoryClear(s);
        default:
          return s;
      }
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setState((s) => backspace(s));
  }, []);

  const handleAngleToggle = useCallback(() => {
    setState((s) => ({
      ...s,
      angleUnit: s.angleUnit === "deg" ? "rad" : "deg",
    }));
  }, []);

  const handleModeChange = useCallback((mode: CalculatorMode) => {
    setState((s) => ({
      ...INITIAL_STATE,
      mode,
      memory: s.memory,
    }));
  }, []);

  return (
    <div className="flex h-full flex-col select-none overflow-hidden">
      {/* ── Mode Switcher (photo-app style pill nav) ── */}
      <div className="flex justify-center px-3 pt-2.5 pb-0">
        <div className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-xl">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              className={`rounded-full px-3.5 py-1 text-[0.7rem] font-medium transition-all duration-200 ${
                state.mode === m
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-fg-muted hover:bg-white/[0.06] hover:text-neutral-200"
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Display ── */}
      <div className="flex-shrink-0">
        <CalculatorDisplay state={state} />
      </div>

      {/* ── Keypad ── */}
      <div className="flex-1 min-h-0 px-3 pb-3">
        {state.mode === "basic" && (
          <BasicKeypad
            onDigit={handleDigit}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onClearEntry={handleClearEntry}
            onToggleSign={handleToggleSign}
            onPercent={handlePercent}
            onBackspace={handleBackspace}
          />
        )}
        {state.mode === "scientific" && (
          <ScientificKeypad
            state={state}
            onDigit={handleDigit}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onClearEntry={handleClearEntry}
            onToggleSign={handleToggleSign}
            onPercent={handlePercent}
            onScientific={handleScientific}
            onAngleToggle={handleAngleToggle}
            onMemory={handleMemory}
            onBackspace={handleBackspace}
          />
        )}
        {state.mode === "programmer" && (
          <ProgrammerKeypad
            state={state}
            onDigit={handleDigit}
            onOperator={handleOperator}
            onEquals={handleEquals}
            onClear={handleClear}
            onBitwise={handleBitwise}
            onBaseChange={handleBaseChange}
            onBackspace={handleBackspace}
          />
        )}
      </div>
    </div>
  );
}
