/**
 * Calculator engine tests.
 *
 * Run: node --experimental-strip-types --experimental-transform-types packages/web/src/apps/calculator/calculator-engine.test.ts
 *
 * Uses Node.js assert — no test framework required.
 */
import assert from "node:assert";
import {
  backspace,
  bitwiseFn,
  bitwiseOperator,
  type CalculatorState,
  calculateBitwiseResult,
  calculateResult,
  clearAll,
  clearEntry,
  evaluate,
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
} from "./calculator-engine.ts";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${e instanceof Error ? e.message : e}`);
  }
}

function approxEqual(a: number, b: number, epsilon = 1e-9) {
  assert(Math.abs(a - b) < epsilon, `Expected ~${b}, got ${a}`);
}

console.log("\n=== Calculator Engine Tests ===\n");

// --- Basic Arithmetic ---
console.log("Basic Arithmetic:");

test("simple addition: 2 + 3 = 5", () => {
  assert.strictEqual(evaluate("2 + 3"), 5);
});

test("simple subtraction: 10 - 4 = 6", () => {
  assert.strictEqual(evaluate("10 - 4"), 6);
});

test("simple multiplication: 6 × 7 = 42", () => {
  assert.strictEqual(evaluate("6 × 7"), 42);
});

test("simple division: 15 ÷ 3 = 5", () => {
  assert.strictEqual(evaluate("15 ÷ 3"), 5);
});

test("division by zero returns NaN", () => {
  assert(Number.isNaN(evaluate("5 ÷ 0")));
});

test("operator precedence: 2 + 3 × 4 = 14", () => {
  assert.strictEqual(evaluate("2 + 3 × 4"), 14);
});

test("multiple operations: 10 + 5 - 3 = 12", () => {
  assert.strictEqual(evaluate("10 + 5 - 3"), 12);
});

test("decimal arithmetic: 0.1 + 0.2 ≈ 0.3", () => {
  approxEqual(evaluate("0.1 + 0.2"), 0.3);
});

test("negative numbers: -5 + 3 = -2", () => {
  assert.strictEqual(evaluate("-5 + 3"), -2);
});

test("chained multiplication: 2 × 3 × 4 = 24", () => {
  assert.strictEqual(evaluate("2 × 3 × 4"), 24);
});

test("parentheses: (2 + 3) × 4 = 20", () => {
  assert.strictEqual(evaluate("(2 + 3) × 4"), 20);
});

test("modulo: 10 % 3 = 1", () => {
  assert.strictEqual(evaluate("10 % 3"), 1);
});

// --- State Machine Tests ---
console.log("\nState Machine:");

test("input digits builds display", () => {
  let s = INITIAL_STATE;
  s = inputDigit(s, "1");
  s = inputDigit(s, "2");
  s = inputDigit(s, "3");
  assert.strictEqual(s.display, "123");
});

test("input operator + digits + equals", () => {
  let s = INITIAL_STATE;
  s = inputDigit(s, "5");
  s = inputOperator(s, "+");
  s = inputDigit(s, "3");
  s = calculateResult(s);
  assert.strictEqual(s.display, "8");
});

test("clear all resets display", () => {
  let s = inputDigit(INITIAL_STATE, "9");
  s = clearAll(s);
  assert.strictEqual(s.display, "0");
  assert.strictEqual(s.expression, "");
});

test("clear entry resets only display", () => {
  let s = inputDigit(INITIAL_STATE, "5");
  s = inputOperator(s, "+");
  s = inputDigit(s, "3");
  s = clearEntry(s);
  assert.strictEqual(s.display, "0");
  assert.notStrictEqual(s.expression, "");
});

test("toggle sign", () => {
  let s = inputDigit(INITIAL_STATE, "5");
  s = toggleSign(s);
  assert.strictEqual(s.display, "-5");
  s = toggleSign(s);
  assert.strictEqual(s.display, "5");
});

test("toggle sign on 0 does nothing", () => {
  const s = toggleSign(INITIAL_STATE);
  assert.strictEqual(s.display, "0");
});

test("percent", () => {
  let s = inputDigit(INITIAL_STATE, "5");
  s = inputDigit(s, "0");
  s = inputPercent(s);
  assert.strictEqual(s.display, "0.5");
});

test("backspace removes last digit", () => {
  let s = inputDigit(INITIAL_STATE, "1");
  s = inputDigit(s, "2");
  s = inputDigit(s, "3");
  s = backspace(s);
  assert.strictEqual(s.display, "12");
});

test("backspace on single digit resets to 0", () => {
  let s = inputDigit(INITIAL_STATE, "5");
  s = backspace(s);
  assert.strictEqual(s.display, "0");
});

test("input decimal point", () => {
  let s = inputDigit(INITIAL_STATE, "3");
  s = inputDigit(s, ".");
  s = inputDigit(s, "1");
  s = inputDigit(s, "4");
  assert.strictEqual(s.display, "3.14");
});

// --- Scientific Mode ---
console.log("\nScientific Functions:");

test("sin(90°) = 1", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "90",
    mode: "scientific",
    angleUnit: "deg",
  };
  const result = scientificFn(s, "sin");
  approxEqual(Number.parseFloat(result.display), 1);
});

test("cos(0°) = 1", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "0",
    mode: "scientific",
    angleUnit: "deg",
  };
  const result = scientificFn(s, "cos");
  approxEqual(Number.parseFloat(result.display), 1);
});

test("tan(45°) = 1", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "45",
    mode: "scientific",
    angleUnit: "deg",
  };
  const result = scientificFn(s, "tan");
  approxEqual(Number.parseFloat(result.display), 1);
});

test("sin(π/2 rad) = 1", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: String(Math.PI / 2),
    mode: "scientific",
    angleUnit: "rad",
  };
  const result = scientificFn(s, "sin");
  approxEqual(Number.parseFloat(result.display), 1);
});

test("ln(e) = 1", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: String(Math.E),
    mode: "scientific",
  };
  const result = scientificFn(s, "ln");
  approxEqual(Number.parseFloat(result.display), 1);
});

test("log(100) = 2", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "100",
    mode: "scientific",
  };
  const result = scientificFn(s, "log");
  approxEqual(Number.parseFloat(result.display), 2);
});

test("sqrt(144) = 12", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "144",
    mode: "scientific",
  };
  const result = scientificFn(s, "sqrt");
  assert.strictEqual(result.display, "12");
});

test("cbrt(27) = 3", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "27",
    mode: "scientific",
  };
  const result = scientificFn(s, "cbrt");
  assert.strictEqual(result.display, "3");
});

test("x² of 7 = 49", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "7",
    mode: "scientific",
  };
  const result = scientificFn(s, "x2");
  assert.strictEqual(result.display, "49");
});

test("x³ of 3 = 27", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "3",
    mode: "scientific",
  };
  const result = scientificFn(s, "x3");
  assert.strictEqual(result.display, "27");
});

test("5! = 120", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "5",
    mode: "scientific",
  };
  const result = scientificFn(s, "x!");
  assert.strictEqual(result.display, "120");
});

test("0! = 1", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "0",
    mode: "scientific",
  };
  const result = scientificFn(s, "x!");
  assert.strictEqual(result.display, "1");
});

test("1/x of 4 = 0.25", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "4",
    mode: "scientific",
  };
  const result = scientificFn(s, "1/x");
  assert.strictEqual(result.display, "0.25");
});

test("1/x of 0 = Error", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "0",
    mode: "scientific",
  };
  const result = scientificFn(s, "1/x");
  assert.strictEqual(result.display, "Error");
  assert.strictEqual(result.error, true);
});

test("e^1 ≈ 2.718", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "1",
    mode: "scientific",
  };
  const result = scientificFn(s, "exp");
  approxEqual(Number.parseFloat(result.display), Math.E);
});

test("10^2 = 100", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "2",
    mode: "scientific",
  };
  const result = scientificFn(s, "pow10");
  assert.strictEqual(result.display, "100");
});

test("|x| of -7 = 7", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "-7",
    mode: "scientific",
  };
  const result = scientificFn(s, "abs");
  assert.strictEqual(result.display, "7");
});

test("π constant", () => {
  const result = scientificFn(INITIAL_STATE, "pi");
  approxEqual(Number.parseFloat(result.display), Math.PI);
});

test("e constant", () => {
  const result = scientificFn(INITIAL_STATE, "e");
  approxEqual(Number.parseFloat(result.display), Math.E);
});

test("asin(1) in deg = 90", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "1",
    mode: "scientific",
    angleUnit: "deg",
  };
  const result = scientificFn(s, "asin");
  approxEqual(Number.parseFloat(result.display), 90);
});

// --- Memory ---
console.log("\nMemory:");

test("memory store and recall", () => {
  let s: CalculatorState = { ...INITIAL_STATE, display: "42" };
  s = memoryStore(s);
  assert.strictEqual(s.memory, 42);
  s = inputDigit(clearEntry(s), "0");
  s = memoryRecall(s);
  assert.strictEqual(s.display, "42");
});

test("memory add", () => {
  let s: CalculatorState = { ...INITIAL_STATE, display: "10" };
  s = memoryStore(s);
  s = { ...clearEntry(s), display: "5" };
  s = memoryAdd(s);
  assert.strictEqual(s.memory, 15);
});

test("memory clear", () => {
  let s: CalculatorState = { ...INITIAL_STATE, display: "10" };
  s = memoryStore(s);
  s = memoryClear(s);
  assert.strictEqual(s.memory, 0);
});

// --- Programmer Mode ---
console.log("\nProgrammer Mode:");

test("decimal to hex conversion", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "255",
    mode: "programmer",
    base: 10,
  };
  const result = setBase(s, 16);
  assert.strictEqual(result.display, "FF");
});

test("decimal to binary conversion", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "10",
    mode: "programmer",
    base: 10,
  };
  const result = setBase(s, 2);
  assert.strictEqual(result.display, "1010");
});

test("decimal to octal conversion", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "8",
    mode: "programmer",
    base: 10,
  };
  const result = setBase(s, 8);
  assert.strictEqual(result.display, "10");
});

test("hex to decimal conversion", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "FF",
    mode: "programmer",
    base: 16,
  };
  const result = setBase(s, 10);
  assert.strictEqual(result.display, "255");
});

test("NOT operation", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "0",
    mode: "programmer",
    base: 10,
  };
  const result = bitwiseFn(s, "NOT");
  assert.strictEqual(result.display, "-1");
});

test("left shift", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "1",
    mode: "programmer",
    base: 10,
  };
  const result = bitwiseFn(s, "<<");
  assert.strictEqual(result.display, "2");
});

test("right shift", () => {
  const s: CalculatorState = {
    ...INITIAL_STATE,
    display: "4",
    mode: "programmer",
    base: 10,
  };
  const result = bitwiseFn(s, ">>");
  assert.strictEqual(result.display, "2");
});

test("AND operation: 12 AND 10 = 8", () => {
  let s: CalculatorState = {
    ...INITIAL_STATE,
    display: "12",
    mode: "programmer",
    base: 10,
  };
  s = bitwiseOperator(s, "AND");
  s = { ...s, display: "10" };
  s = calculateBitwiseResult(s);
  assert.strictEqual(s.display, "8");
});

test("OR operation: 12 OR 10 = 14", () => {
  let s: CalculatorState = {
    ...INITIAL_STATE,
    display: "12",
    mode: "programmer",
    base: 10,
  };
  s = bitwiseOperator(s, "OR");
  s = { ...s, display: "10" };
  s = calculateBitwiseResult(s);
  assert.strictEqual(s.display, "14");
});

test("XOR operation: 12 XOR 10 = 6", () => {
  let s: CalculatorState = {
    ...INITIAL_STATE,
    display: "12",
    mode: "programmer",
    base: 10,
  };
  s = bitwiseOperator(s, "XOR");
  s = { ...s, display: "10" };
  s = calculateBitwiseResult(s);
  assert.strictEqual(s.display, "6");
});

// --- Edge Cases ---
console.log("\nEdge Cases:");

test("large number: 999999999 × 999999999", () => {
  const result = evaluate("999999999 × 999999999");
  assert.strictEqual(result, 999999998000000000);
});

test("very small decimal: 0.0001 + 0.0002 ≈ 0.0003", () => {
  approxEqual(evaluate("0.0001 + 0.0002"), 0.0003);
});

test("error state prevents operations", () => {
  const errorState: CalculatorState = {
    ...INITIAL_STATE,
    display: "Error",
    error: true,
  };
  const s = inputOperator(errorState, "+");
  assert.strictEqual(s.display, "Error"); // No change
});

test("error state resets on digit input", () => {
  const errorState: CalculatorState = {
    ...INITIAL_STATE,
    display: "Error",
    error: true,
  };
  const s = inputDigit(errorState, "5");
  assert.strictEqual(s.display, "5");
  assert.strictEqual(s.error, false);
});

test("chained operations: 10 + 5 × 2 = 20 (precedence)", () => {
  assert.strictEqual(evaluate("10 + 5 × 2"), 20);
});

// --- Summary ---
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
