import React, { useEffect, useState } from "react";
import "./MainComponent.css";

import {
  calculatedTemperature,
  getTwoDigitHour,
  getTwoDigitMinute,
} from "../utils";
const MainComponent = () => {
  const [data, setData] = useState({
    weatherMode: "Haze",
    weatherIcon: "50n",
    coordinate: {
      lat: 40.73,
      lon: -73.93,
    },
    temperature: "82.49",
    humidity: 44,
    wind: 5.75,
    sunrise: 1669162719,
    sunset: 1669201880,
    country: "BANGLADESH",
    city: "DHAKA DISTRICT",
  });
  const [address, setAddress] = useState("Dhaka, Bangladesh");
  useEffect(() => {
    setAddress(`${data.city}, ${data.country}`);
  }, [data.city, data.country]);
  const [sunrise, setSunrise] = useState("N/A");
  useEffect(() => {
    setSunrise(
      `${getTwoDigitHour(data.sunrise)}:${getTwoDigitMinute(data.sunrise)}`
    );
  }, [data.sunrise]);
  const [sunset, setSunset] = useState("N/A");
  useEffect(() => {
    setSunset(
      `${getTwoDigitHour(data.sunset)}:${getTwoDigitMinute(data.sunset)}`
    );
  }, [data.sunset]);
  const [temperatureType, setTemperatureType] = useState("Fahrenheit");
  const ipAddress = "0.0.0.0";
  const dynamicWeatherIcon = () => {
    let icon = data.weatherIcon.substring(0, 2);
    let str = "";
    switch (icon) {
      case "01":
        str = "sunny";
        break;
      case "02":
      case "03":
      case "04":
        str = "cloudy";
        break;
      case "09":
      case "10":
      case "11":
        str = "rainy";
        break;
      case "13":
        str = "snow";
        break;
      case "50":
        str = "windy";
        break;
      default:
        str = "windy";
        break;
    }
    return `${str}.svg`;
  };
  return (
    <>
      <div className="container">
        <div className="d-flex">
          <p>{address}</p>
        </div>
        <div className="d-flex">
          <h3>
            {calculatedTemperature(temperatureType, data.temperature)}°
            {temperatureType === "Celsius" ? "C" : "F"} |{data.weatherMode}
          </h3>
        </div>
        <div className="d-flex">
          <img src={dynamicWeatherIcon()} alt="weather_icon" />
        </div>
        <div className="mt-20 flex-between">
          <p>HUMIDITY</p>
          <p>{data.humidity}%</p>
        </div>
        <div className="flex-between">
          <p>WIND</p>
          <p>{data.wind} M/S</p>
        </div>
        <div className="flex-between">
          <p>SUNRISE</p>
          <p>{sunrise}</p>
        </div>
        <div className="flex-between">
          <p>SUNSET</p>
          <p>{sunset}</p>
        </div>
        <div className="mt-20">
          <button
            className="btn"
            onClick={() =>
              setTemperatureType(
                temperatureType === "Fahrenheit" ? "Celsius" : "Fahrenheit"
              )
            }
          >
            Convert to&nbsp;
            {temperatureType === "Fahrenheit" ? "Celsius" : "Fahrenheit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MainComponent;
