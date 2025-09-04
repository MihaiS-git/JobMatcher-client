export function formatDate(date: Date | string, locale = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/* console.log(formatDate("2025-09-04", "en-US")); // 09/04/2025
console.log(formatDate("2025-09-04", "de-DE")); // 04.09.2025
console.log(formatDate("2025-09-04", "en-GB")); // 04/09/2025 */
