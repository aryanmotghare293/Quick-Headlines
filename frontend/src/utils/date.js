const shortDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const dateTime = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : shortDate.format(date);
};

export const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : dateTime.format(date);
};
