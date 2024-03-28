const dateLanguage = ["es-UY", "es-CR"]; // Returns "set" for September
const dateOptions = {
  month: { year: "numeric", month: "long" },
  short: { year: "numeric", month: "short", day: "numeric" },
  long: { year: "numeric", month: "long", day: "numeric" },
  full: { weekday: "long", year: "numeric", month: "long", day: "numeric" },
};
const timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};

/**
 * Converts an API date string to a local date string to use it as an HTML attribute.
 * @param {!string} apiDateString The date string from the API.
 * @returns {string} The local date string to use as an HTML attribute.
 */
export const convertApiDateToHtmlAttribute = (apiDateString) => {
  const apiDate = new Date(
    apiDateString + (apiDateString.endsWith("Z") ? "" : "Z")
  );
  return new Date(
    Date.UTC(
      apiDate.getFullYear(),
      apiDate.getMonth(),
      apiDate.getDate(),
      apiDate.getHours(),
      apiDate.getMinutes(),
      apiDate.getSeconds()
    )
  )
    .toISOString()
    .split(".")[0];
};

/**
 * Returns the current date and time as a local date string to use it as an HTML attribute.
 * @returns {string} The current date and time as a local date string to use as an HTML attribute.
 */
export const getCurrentDateAsHtmlAttribute = () => {
  const currentDate = new Date();
  return new Date(
    Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      0
    )
  )
    .toISOString()
    .split(".")[0];
};

/**
 * Converts an API date string to a local date string.
 * @param {!string} apiDateString The date string from the API.
 * @param {?string} dateType The format of the date string.
 *        Possible values:
 *        - "month": Format showing only the year and month.
 *        - "short": Short format, typically including year, month, and day.
 *        - "long": Longer format, more descriptive than "short".
 *        - "full": Full format, most verbose, including the day of the week.
 * @param {?boolean} capitalizeFirstLetter Whether to capitalize the first letter of the result.
 * @returns
 */
export const convertApiDateToLocalString = (
  apiDateString,
  dateType,
  capitalizeFirstLetter = false
) => {
  try {
    const apiDate = new Date(
      apiDateString + (apiDateString.endsWith("Z") ? "" : "Z")
    );
    const seletedOptions = { ...dateOptions[dateType] } || {
      ...dateOptions["short"],
    };

    // If the year is the current year, we don't show it
    if (apiDate.getFullYear() === new Date().getFullYear()) {
      delete seletedOptions.year;
    }

    const result = apiDate.toLocaleDateString(dateLanguage, seletedOptions);

    if (capitalizeFirstLetter) {
      return result.charAt(0).toUpperCase() + result.slice(1);
    } else {
      return result;
    }
  } catch (error) {
    return "";
  }
};

/**
 * Converts an API date string to a local time string.
 * @param {string} apiDateString The date string from the API.
 * @param {string} timeType The format of the time string.
 *        Possible values: "short", "long".
 *        - "short": Short format, including hour and minute.
 *        - "long": Longer format, including hour, minute, and second.
 * @returns {string} The local time string.
 */
export const convertApiTimeToLocalString = (
  apiDateString,
  timeType = "short"
) => {
  try {
    const apiDate = new Date(
      apiDateString + (apiDateString.endsWith("Z") ? "" : "Z")
    );
    const currentTimeOptions = timeOptions;

    if (timeType === "short") {
      delete currentTimeOptions.second;
    }

    // Some browsers mistakenly return 00:00 a. m. for 12:00 a. m., so we replace it with 12:00 a. m.
    return apiDate
      .toLocaleTimeString(dateLanguage, currentTimeOptions)
      .replace(/^00/, "12");
  } catch (error) {
    return "";
  }
};

/**
 * Converts an API date string to a local date and time string.
 * @param {!string} apiDateString The date string from the API.
 * @param {?string} dateType The format of the date string.
 *        Possible values:
 *        - "month": Format showing only the year and month.
 *        - "short": Short format, typically including year, month, and day.
 *        - "long": Longer format, more descriptive than "short".
 *        - "full": Full format, most verbose, including the day of the week.
 * @param {?string} timeType The format of the time string.
 *        Possible values: "short", "long".
 *        - "short": Short format, including hour and minute.
 *        - "long": Longer format, including hour, minute, and second.
 * @returns {string} The local date and time string.
 */
export const convertApiDateTimeToLocalString = (
  apiDateString,
  dateType,
  timeType
) => {
  const separator = dateType === "full" ? " el " : ", ";
  return `${convertApiTimeToLocalString(
    apiDateString,
    timeType
  )}${separator}${convertApiDateToLocalString(apiDateString, dateType)}`.trim();
};

/**
 * Converts a local datetime string to an ISO string, for API requests.
 * @param {(!string|!Date)} dateTimeString The local datetime string.
 * @returns {string|undefined} The ISO string or undefined if the conversion fails.
 */
export const convertLocalDateTimeToIso = (dateTimeString) => {
  try {
    const localDate = new Date(dateTimeString);
    return localDate.toISOString();
  } catch (error) {
    return undefined;
  }
};
