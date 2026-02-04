function getOrdinalSuffix(date: any) {
  const day = Number(date);

  if (day >= 11 && day <= 13) return `${day}th`;

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export const formatDateEnGB = (date: any) => {
  //this if condition is to convert DD-MM-YYYY to DD/MM/YYY
  if (String(date)?.includes("-")) {
    const newDate = date?.split("-");
    return `${newDate[2]}/${newDate[1]}/${newDate[0]}`;
  } else {
    const eventFormat = new Date(Date.UTC(date?.$y, date?.$M, date?.$D));
    return eventFormat
      .toLocaleString("en-GB", { timeZone: "UTC" })
      .split(",")[0];
  }
};

export const convertDateFormat = (dateString: any) => {
  // Parse the original date string
  const dateObj = new Date(dateString);

  // Extract day, month, and year components
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Months are zero-based
  const year = dateObj.getFullYear();

  // Pad single-digit day/month values with leading zeros
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Reconstruct the date in the desired format
  return `${formattedDay}-${formattedMonth}-${year}`;
};

export const formatDateWithMON = (date: any) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const givenDate = new Date(date);

  let gmtOffsetHours = givenDate.getTimezoneOffset() / 60;

  if (gmtOffsetHours < 0) {
    const day = String(givenDate.getDate()).padStart(2, "0");
    const monthIndex = givenDate.getMonth();
    const monthName = monthNames[monthIndex];
    const year = String(givenDate.getFullYear()).slice(-2);
    return `${getOrdinalSuffix(day)} ${monthName}'${year}`;
  } else {
    const day = String(givenDate.getUTCDate()).padStart(2, "0");
    const monthIndex = givenDate.getUTCMonth();
    const monthName = monthNames[monthIndex];
    const year = givenDate.getUTCFullYear();

    return `${getOrdinalSuffix(day)} ${monthName}'${year}`;
  }
};

export const formatDateOnly = (value: string | Date | null): string | null => {
  if (!value) return null;
  const dateObj = typeof value === "string" ? new Date(value) : value;
  return dateObj?.toISOString()?.split("T")[0];
};
