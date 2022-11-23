export const countryCodeToCountryName = (code) => {
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });
  return regionNamesInEnglish.of(code);
};

// convert temperature based on temperatureType
export const calculatedTemperature = (type, data) => {
  const temp = type === "Fahrenheit" ? data : ((data - 32) / 1.8).toFixed(1);
  return temp;
};

// extract IpAddress from api response
export const extractIpAddress = (str) => {
  return str.split("\n")[2].trim().substring(3);
};

// return 2 digit Hour
export const getTwoDigitHour = (number) => {
  return String(new Date(number * 1000).getHours()).padStart(2, "0");
};

// return 2 digit Minute
export const getTwoDigitMinute = (number) => {
  return String(new Date(number * 1000).getMinutes()).padStart(2, "0");
};
