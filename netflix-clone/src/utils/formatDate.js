export function formatDate(
  date,
  options = {}
) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    }
  );
}

export function formatShortDate(date) {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatYear(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.getFullYear().toString();
}