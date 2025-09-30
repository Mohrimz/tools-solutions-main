// Test cases for formatPriceLKR
export const priceTestCases = [
  { input: 4950, expected: "Rs 4,950" },
  { input: 1000, expected: "Rs 1,000" },
  { input: 850, expected: "Rs 850" },
  { input: 12500, expected: "Rs 12,500" },
]

// Test cases for getStockStatus
export const stockTestCases = [
  { input: 0, expected: "out" },
  { input: 5, expected: "low" },
  { input: 9, expected: "low" },
  { input: 10, expected: "in" },
  { input: 25, expected: "in" },
]
