import { Pipe, PipeTransform } from '@angular/core';

const NUMERIC = /^-?\d+(\.\d+)?$/;

const compact = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${trimTo1(amount / 1_000_000)}M`;
  if (abs >= 1_000) return `${trimTo1(amount / 1_000)}K`;
  return `${Math.round(amount)}`;
};

const trimTo1 = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
};

@Pipe({
  name: 'marketValue',
})
export class MarketValuePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') return '-';

    const raw = typeof value === 'number' ? String(value) : value.trim();
    if (!NUMERIC.test(raw)) return raw;

    const amount = Number(raw);
    if (!Number.isFinite(amount)) return '-';

    return `€${compact(amount)}`;
  }
}
