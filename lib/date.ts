export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
