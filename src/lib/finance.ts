// Loan / deposit arithmetic for the financial-literacy calculator.

/** Reducing-balance EMI. rate = annual % ; months > 0. */
export function emi(principal: number, rate: number, months: number) {
  const r = rate / 12 / 100;
  const m = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const total = m * months;
  return { monthly: m, total, interest: total - principal };
}

/** Flat / simple interest on the full principal for the whole term. */
export function simpleInterest(principal: number, rate: number, months: number) {
  const interest = (principal * rate * months) / 1200;
  return { interest, total: principal + interest, monthly: (principal + interest) / months };
}

/** Fixed deposit maturity with quarterly compounding (common for cooperative/bank FDs). */
export function fdMaturity(principal: number, rate: number, months: number) {
  const maturity = principal * (1 + rate / 400) ** (months / 3);
  return { maturity, interest: maturity - principal };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
