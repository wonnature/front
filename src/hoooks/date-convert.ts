export const dateConvert = (dateStr: string) => {
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");

  return `${year.toString().slice(2)}-${month}-${day}`;
};

export const dateTimeConvert = (dateStr: string) => {
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${year.toString().slice(2)}-${month}-${day} ${hours}:${minutes}`;
};
