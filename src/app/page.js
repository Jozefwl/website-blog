"use client"
import { useState, useEffect } from "react";
import TextAnim from "../components/animatedtext";
import Metrics from "../components/metrics";
import WeatherWidget from "../components/weatherwidget";
import Infobox from "../components/infobox";

import "../css/textanim.css";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 50);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  Date.prototype.getWeekNumber = function () {
    const oneJan = new Date(this.getFullYear(), 0, 1);
    //console.log(oneJan); //debug
    const numberOfDays = Math.floor((this - oneJan) / (24 * 60 * 60 * 1000));
    //console.log(numberOfDays); //debug
    //const numberOfDays = 131; 
    const weekNumber = (numberOfDays-numberOfDays%7)/7 + 1;
    return weekNumber;
  }

  const isoDate = currentTime.toISOString().split("T");
  const week = currentTime.getWeekNumber();
  const year = currentTime.getFullYear();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <TextAnim text="waldhauser.sk" />

      <Infobox
        title="Welcome to Jozef's website"
        content={[
          `It is week ${week} of the year ${year}.`,
          `Date: ${isoDate[0]}`,
          `Time: ${isoDate[1]}`,
        ]}
      />
      <hr style={{ border: "1px solid rgb(0, 0, 71)", margin: "20px 0" }} />
      <Metrics />
      <WeatherWidget />
    </div>
  );
}