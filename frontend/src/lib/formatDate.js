
export const formatDate = (dateValue) => {
  const date = typeof dateValue === "string" || typeof dateValue === "number"
    ? new Date(dateValue)
    : dateValue;

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "date invalide";
  }

  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const seconds = Math.abs(diffSeconds);

  const units = [
    { limit: 60, value: 1, label: "s" },
    { limit: 3600, value: 60, label: "min" },
    { limit: 86400, value: 3600, label: "h" },
    { limit: 2592000, value: 86400, label: "j" },
    { limit: 31536000, value: 2592000, label: "mois" },
    { limit: Infinity, value: 31536000, label: "an" },
  ];

  for (const unit of units) {
    if (seconds < unit.limit) {
      const count = Math.floor(seconds / unit.value) || 1;
      const label = unit.label === "an" && count > 1 ? "ans" : unit.label;
      return `${count}${label}`;
    }
  }

  return "maintenant";
};