// Owner auto-approval rules. A repair is auto-approved only if it passes every enabled rule.

export const DEFAULT_RULES = {
  enabled: true,
  maxAmount: 250,
  benchmarkOnly: true, // quote must fall within the AI fair-market benchmark range
  urgencies: { urgent: true, standard: true, flexible: true },
  categories: { plumbing: true, electrical: false, hvac: true, appliance: true, pest: true, other: false },
  vendorPolicy: 'vetted', // vetted | preferred
  minRating: 4.8,
  monthlyCap: 1000, // per-property auto-approved spend per month
  properties: { maple: true, harbor: true, oak: true },
  notify: true,
};

export const URGENCY_LABELS = { urgent: 'Urgent', standard: 'Standard', flexible: 'Flexible' };

// Returns { ok, reasons[] } for a ticket + quote under the given rules.
export function evaluate(rules, { category, urgency, price, propertyId = 'maple', rating = 5, preferred = false, benchmarkMax = 240, spentThisMonth = 0 }) {
  if (!rules.enabled) return { ok: false, reasons: ['Auto-approval is turned off'] };
  const reasons = [];
  if (price > rules.maxAmount) reasons.push(`Quote $${price} exceeds $${rules.maxAmount} limit`);
  if (rules.benchmarkOnly && price > benchmarkMax) reasons.push(`Quote above $${benchmarkMax} benchmark`);
  if (!rules.urgencies[urgency]) reasons.push(`${URGENCY_LABELS[urgency] || urgency} tickets need manual review`);
  if (!rules.categories[category]) reasons.push('Issue type needs manual review');
  if (rules.properties[propertyId] === false) reasons.push('Property excluded from auto-approval');
  if (rules.vendorPolicy === 'preferred' && !preferred) reasons.push('Vendor not on your preferred list');
  if (rules.vendorPolicy === 'vetted' && rating < rules.minRating) reasons.push(`Vendor rated below ${rules.minRating}★`);
  if (spentThisMonth + price > rules.monthlyCap) reasons.push(`Would exceed $${rules.monthlyCap}/mo property cap`);
  return { ok: reasons.length === 0, reasons };
}

export function summarize(rules, categoryCount) {
  if (!rules.enabled) return 'Off — every repair needs your approval';
  const cats = Object.values(rules.categories).filter(Boolean).length;
  const urg = Object.entries(rules.urgencies)
    .filter(([, v]) => v)
    .map(([k]) => URGENCY_LABELS[k])
    .join(', ');
  return `Up to $${rules.maxAmount} · ${cats} of ${categoryCount} issue types · ${urg || 'no urgency levels'}`;
}
