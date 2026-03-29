export function getDiffDays(from: Date, to: Date) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function formatYearMonth(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}.${month}`;
}

export function formatYearMonthDay(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}