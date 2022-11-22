import React, { useState } from "react";
import "./MainComponent.css";
const MainComponent = () => {
  const [location, setLocation] = useState("Dhaka");
  return (
    <>
      <div className="container">
        <p>{location}</p>
      </div>
    </>
  );
};

export default MainComponent;
