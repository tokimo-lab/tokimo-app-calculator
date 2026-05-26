export type CalculatorMode = "basic" | "scientific" | "programmer";

export type AngleUnit = "deg" | "rad";

export interface CalculatorState {
  display: string;
  expression: string;
  memory: number;
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  base: 10 | 16 | 8 | 2;
  error: boolean;
}

export const INITIAL_STATE: CalculatorState = {
  display: "0",
  expression: "",
  memory: 0,
  mode: "basic",
  angleUnit: "deg",
  base: 10,
  error: false,
};

function toRadians(value: number, unit: AngleUnit): number {
  return unit === "deg" ? (value * Math.PI) / 180 : value;
}

function toDegrees(value: number, unit: AngleUnit): number {
  return unit === "deg" ? (value * 180) / Math.PI : value;
}

function formatNumber(n: number, base: number): string {
  if (!Number.isFinite(n)) return "Error";
  if (base === 10) {
    const s = String(n);
    if (s.length > 15) return n.toPrecision(10);
    return s;
  }
  const int = Math.trunc(n);
  if (base === 16) return int.toString(16).toUpperCase();
  if (base === 8) return int.toString(8);
  if (base === 2) return int.toString(2);
  return String(n);
}

function parseDisplay(display: string, base: number): number {
  if (base === 16) return Number.parseInt(display, 16);
  if (base === 8) return Number.parseInt(display, 8);
  if (base === 2) return Number.parseInt(display, 2);
  return Number.parseFloat(display);
}

export function evaluate(expr: string): number {
  // Simple expression evaluator using shunting-yard algorithm
  const tokens = tokenize(expr);
  const output: number[] = [];
  const ops: string[] = [];

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "×": 2,
    "÷": 2,
    "%": 2,
  };

  const applyOp = (op: string, b: number, a: number): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) return Number.NaN;
        return a / b;
      case "%":
        if (b === 0) return Number.NaN;
        return a % b;
      default:
        return Number.NaN;
    }
  };

  for (const token of tokens) {
    if (token === "(") {
      ops.push(token);
    } else if (token === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        const op = ops.pop()!;
        const b = output.pop() ?? 0;
        const a = output.pop() ?? 0;
        output.push(applyOp(op, b, a));
      }
      ops.pop(); // remove "("
    } else if (token in precedence) {
      while (
        ops.length > 0 &&
        ops[ops.length - 1] !== "(" &&
        (precedence[ops[ops.length - 1]] ?? 0) >= precedence[token]
      ) {
        const op = ops.pop()!;
        const b = output.pop() ?? 0;
        const a = output.pop() ?? 0;
        output.push(applyOp(op, b, a));
      }
      ops.push(token);
    } else {
      output.push(Number.parseFloat(token));
    }
  }

  while (ops.length > 0) {
    const op = ops.pop()!;
    const b = output.pop() ?? 0;
    const a = output.pop() ?? 0;
    output.push(applyOp(op, b, a));
  }

  return output[0] ?? 0;
}

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];
    if (ch === " ") {
      if (current) {
        tokens.push(current);
        current = "";
      }
      i++;
      continue;
    }
    if ("+-×÷%()".includes(ch)) {
      // Handle negative numbers at start or after operator/open paren
      if (
        ch === "-" &&
        (tokens.length === 0 || "+-×÷%(".includes(tokens[tokens.length - 1]))
      ) {
        current += ch;
        i++;
        continue;
      }
      if (current) {
        tokens.push(current);
        current = "";
      }
      tokens.push(ch);
    } else {
      current += ch;
    }
    i++;
  }
  if (current) tokens.push(current);
  return tokens;
}

export function inputDigit(
  state: CalculatorState,
  digit: string,
): CalculatorState {
  if (state.error) {
    return { ...state, display: digit, expression: "", error: false };
  }
  const display =
    state.display === "0" && digit !== "." ? digit : state.display + digit;
  return { ...state, display };
}

export function inputOperator(
  state: CalculatorState,
  op: string,
): CalculatorState {
  if (state.error) return state;
  const expression = `${state.expression + state.display} ${op} `;
  return { ...state, expression, display: "0" };
}

export function calculateResult(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  const fullExpr = state.expression + state.display;
  if (!fullExpr.trim()) return state;
  const result = evaluate(fullExpr);
  if (!Number.isFinite(result)) {
    return { ...state, display: "Error", expression: "", error: true };
  }
  return {
    ...state,
    display: formatNumber(result, state.base),
    expression: "",
  };
}

export function clearAll(state: CalculatorState): CalculatorState {
  return {
    ...INITIAL_STATE,
    mode: state.mode,
    angleUnit: state.angleUnit,
    base: state.base,
    memory: state.memory,
  };
}

export function clearEntry(state: CalculatorState): CalculatorState {
  return { ...state, display: "0", error: false };
}

export function toggleSign(state: CalculatorState): CalculatorState {
  if (state.error || state.display === "0") return state;
  const display = state.display.startsWith("-")
    ? state.display.slice(1)
    : `-${state.display}`;
  return { ...state, display };
}

export function inputPercent(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  const val = parseDisplay(state.display, state.base) / 100;
  return { ...state, display: formatNumber(val, state.base) };
}

// Scientific functions
export function scientificFn(
  state: CalculatorState,
  fn: string,
): CalculatorState {
  if (state.error) return state;
  const val = parseDisplay(state.display, state.base);
  let result: number;

  switch (fn) {
    case "sin":
      result = Math.sin(toRadians(val, state.angleUnit));
      break;
    case "cos":
      result = Math.cos(toRadians(val, state.angleUnit));
      break;
    case "tan":
      result = Math.tan(toRadians(val, state.angleUnit));
      break;
    case "asin":
      result = toDegrees(Math.asin(val), state.angleUnit);
      break;
    case "acos":
      result = toDegrees(Math.acos(val), state.angleUnit);
      break;
    case "atan":
      result = toDegrees(Math.atan(val), state.angleUnit);
      break;
    case "ln":
      result = Math.log(val);
      break;
    case "log":
      result = Math.log10(val);
      break;
    case "sqrt":
      result = Math.sqrt(val);
      break;
    case "cbrt":
      result = Math.cbrt(val);
      break;
    case "x2":
      result = val * val;
      break;
    case "x3":
      result = val * val * val;
      break;
    case "1/x":
      result = val === 0 ? Number.NaN : 1 / val;
      break;
    case "x!": {
      result = factorial(Math.trunc(val));
      break;
    }
    case "exp":
      result = Math.exp(val);
      break;
    case "pi":
      result = Math.PI;
      break;
    case "e":
      result = Math.E;
      break;
    case "pow10":
      result = 10 ** val;
      break;
    case "abs":
      result = Math.abs(val);
      break;
    default:
      return state;
  }

  if (!Number.isFinite(result)) {
    return { ...state, display: "Error", expression: "", error: true };
  }
  return { ...state, display: formatNumber(result, state.base) };
}

function factorial(n: number): number {
  if (n < 0) return Number.NaN;
  if (n > 170) return Number.POSITIVE_INFINITY;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Programmer functions
export function bitwiseFn(state: CalculatorState, fn: string): CalculatorState {
  if (state.error) return state;
  const val = Math.trunc(parseDisplay(state.display, state.base));
  let result: number;

  switch (fn) {
    case "NOT":
      result = ~val;
      break;
    case "<<":
      result = val << 1;
      break;
    case ">>":
      result = val >> 1;
      break;
    default:
      return state;
  }

  return { ...state, display: formatNumber(result, state.base) };
}

export function bitwiseOperator(
  state: CalculatorState,
  op: string,
): CalculatorState {
  if (state.error) return state;
  // Store as expression with special bitwise ops
  const mappedOp =
    op === "AND" ? "&" : op === "OR" ? "|" : op === "XOR" ? "^" : op;
  const val = Math.trunc(parseDisplay(state.display, state.base));
  const expression = `${state.expression + String(val)} ${mappedOp} `;
  return { ...state, expression, display: "0" };
}

export function calculateBitwiseResult(
  state: CalculatorState,
): CalculatorState {
  if (state.error) return state;
  const val = Math.trunc(parseDisplay(state.display, state.base));
  const fullExpr = state.expression + String(val);
  if (!fullExpr.trim()) return state;

  // Simple bitwise eval
  const result = evalBitwise(fullExpr);
  if (!Number.isFinite(result)) {
    return { ...state, display: "Error", expression: "", error: true };
  }
  return {
    ...state,
    display: formatNumber(result, state.base),
    expression: "",
  };
}

function evalBitwise(expr: string): number {
  // Very simple: split by operators, evaluate left to right
  const parts = expr.split(/\s+/);
  let result = Number.parseInt(parts[0], 10);
  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i];
    const val = Number.parseInt(parts[i + 1], 10);
    switch (op) {
      case "&":
        result = result & val;
        break;
      case "|":
        result = result | val;
        break;
      case "^":
        result = result ^ val;
        break;
      case "+":
        result = result + val;
        break;
      case "-":
        result = result - val;
        break;
      case "×":
        result = result * val;
        break;
      case "÷":
        result = val === 0 ? Number.NaN : Math.trunc(result / val);
        break;
      default:
        break;
    }
  }
  return result;
}

export function setBase(
  state: CalculatorState,
  base: 10 | 16 | 8 | 2,
): CalculatorState {
  // Convert current display value to new base
  const val = parseDisplay(state.display, state.base);
  return {
    ...state,
    base,
    display: formatNumber(val, base),
    expression: "",
  };
}

export function memoryStore(state: CalculatorState): CalculatorState {
  return { ...state, memory: parseDisplay(state.display, state.base) };
}

export function memoryRecall(state: CalculatorState): CalculatorState {
  return { ...state, display: formatNumber(state.memory, state.base) };
}

export function memoryAdd(state: CalculatorState): CalculatorState {
  return {
    ...state,
    memory: state.memory + parseDisplay(state.display, state.base),
  };
}

export function memoryClear(state: CalculatorState): CalculatorState {
  return { ...state, memory: 0 };
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  if (
    state.display.length <= 1 ||
    (state.display.length === 2 && state.display.startsWith("-"))
  ) {
    return { ...state, display: "0" };
  }
  return { ...state, display: state.display.slice(0, -1) };
}
