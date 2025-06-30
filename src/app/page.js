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
  // Create a copy of the date to avoid modifying the original
  let date = new Date(this);
  date.setHours(0, 0, 0, 0);
  // Set to the nearest Thursday (ISO week starts on Monday, but counting is easier with Thursday)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // Get the first day of the year
  let yearStart = new Date(date.getFullYear(), 0, 1);
  // Calculate the number of days since the year start
  let dayCount = Math.floor((date - yearStart) / (24 * 60 * 60 * 1000));
  // Calculate week number
  let weekNumber = Math.ceil((dayCount + 1) / 7);
  return weekNumber;
};

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