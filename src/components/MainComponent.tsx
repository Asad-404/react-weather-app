import React, { useEffect, useState } from "react";
import "./MainComponent.css";

import {
  calculatedTemperature,
  countryCodeToCountryName,
  extractIpAddress,
  getTwoDigitHour,
  getTwoDigitMinute,
} from "../utils";
const MainComponent = () => {
  const [data, setData] = useState({
    weatherMode: "Loading ...",
    weatherIcon: "Loading ...",
    coordinate: {
      lat: 51.509865,
      lon: -0.118092,
    },
    temperature: "Loading ...",
    humidity: 44,
    wind: 5.75,
    sunrise: 1669162719,
    sunset: 1669201880,
    country: "Loading ...",
    city: "Loading ...",
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
  useEffect(() => {
    getCoordinate();
  }, []);
  const [temperatureType, setTemperatureType] = useState("Fahrenheit");
  const [ipAddress, setIpAddress] = useState("0.0.0.0");
  interface position {
    coords: {
      latitude: number;
      longitude: number;
    };
  }
  const getCoordinate = () => {
    const success = (position: position) => {
      setData({
        ...data,
        coordinate: {
          lat: Number(position.coords.latitude.toFixed(2)),
          lon: Number(position.coords.longitude.toFixed(2)),
        },
      });
      fetchData(
        Number(position.coords.latitude.toFixed(2)),
        Number(position.coords.longitude.toFixed(2))
      );
    };
    const error = (err: any) => {
      alert(`ERROR(${err.code}): ${err.message}`);
      getIpAddress();
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  // if user is denied to access location
  // get user ip address
  const getIpAddress = async () => {
    try {
      const res = await fetch(`https://www.cloudflare.com/cdn-cgi/trace`);
      setIpAddress(extractIpAddress(await res.text())); // extract IP Address from the response
      getLatLonManually();
    } catch (err: any) {
      alert(`ERROR IN getIpAddress FETCHING:${err.message}`);
    }
  };

  // get user location by ip address
  const getLatLonManually = async () => {
    try {
      const res = await fetch(
        `https://api.apilayer.com/ip_to_location/${ipAddress}`,
        {
          method: "GET",
          headers: {
            apikey: "Dy7bzi8Qh8yW2DbzHlgyU7LecZN6pGoc",
          },
        }
      ).then((response) => response.json());
      setData({
        ...data,
        coordinate: {
          lat: res.latitude.toFixed(2),
          lon: res.longitude.toFixed(2),
        },
      });
      fetchData(res.latitude.toFixed(2), res.longitude.toFixed(2));
    } catch (err: any) {
      alert(`ERROR IN getLatLonManually FETCHING:${err.message}`);
    }
  };

  // before fetching just checking localStorage data is valid to use
  const fetchData = (lat: number, lon: number) => {
    if (localStorage.getItem("weatherData")) {
      const res = JSON.parse(localStorage.getItem("weatherData") || "");
      if (
        Number(res.coordinate.lat.toFixed(2)) !== lat ||
        Number(res.coordinate.lon.toFixed(2)) !== lon ||
        new Date().getTime() - new Date(res.date).getTime() > 1800000
      ) {
        // cross checking with localStorage
        // if localStorage latitude & present latitude is not same
        // or longitude longitude & present longitude is not same
        // or last api call time & present time difference is greater than 30 minutes
        // any one of the above conditions is true thn call the data fetch api
        getWeatherData(lat, lon);
      } else {
        // if localStorage data available & valid to use
        // retrieve data from localStorage to reactive object
        setData({
          ...data,
          weatherMode: res.weatherMode,
          weatherIcon: res.weatherIcon,
          temperature: res.temperature,
          humidity: res.humidity,
          wind: res.wind,
          sunrise: res.sunrise,
          sunset: res.sunset,
          country: res.country,
          city: res.city,
        });
      }
    } else {
      getWeatherData(lat, lon);
    }
  };

  // Right now  https://darksky.net/dev/ not accepting new signup
  // Get weather data from https://api.openweathermap.org in Imperial unit system
  const getWeatherData = async (lat: number, lon: number) => {
    try {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Imperial&appid=5ae1a521a60a1bbba2a698d1a3466cb6`
      )
        .then((response) => response.json())
        .then((res) => {
          // store response data into reactive state object
          const weatherData = {
            weatherMode: res.weather[0].main,
            weatherIcon: res.weather[0].icon,
            coordinate: {
              lat: Number(res.coord.lat.toFixed(2)),
              lon: Number(res.coord.lon.toFixed(2)),
            },
            temperature: res.main.temp,
            humidity: res.main.humidity,
            wind: res.wind.speed,
            sunrise: res.sys.sunrise,
            sunset: res.sys.sunset,
            city: res.name,
            country: countryCodeToCountryName(res.sys.country),
          };
          setData(weatherData);
          // save data into localStorage for future use
          localStorage.setItem(
            "weatherData",
            JSON.stringify({
              date: new Date(),
              ...weatherData,
            })
          );
        });
    } catch (err: any) {
      alert(`ERROR IN DATA FETCHING:${err.message}`);
    }
  };

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
            {temperatureType === "Celsius" ? "C" : "F"} | {data.weatherMode}
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
