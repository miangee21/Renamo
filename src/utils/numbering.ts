//src/utils/numbering.ts

// ============================================
// Renamo — Numbering Logic (No Padding)
// ============================================

/**
 * Simple sequential number — no zero padding ever
 * 1, 2, 3 ... 445, 446 ... 10001, 10002
 */
export function getNumberedName(
  num: number,
  _startNumber: number,
  _totalFiles: number,
): string {
  return num.toString();
}
