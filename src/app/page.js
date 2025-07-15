"use client"
import { useState, useEffect } from "react";
import TextAnim from "../components/animatedtext";
import Metrics from "../components/metrics";
import WeatherWidget from "../components/weatherwidget";
import Infobox from "../components/infobox";
import CookieNotice from "../components/cookienotice";
import "../css/textanim.css";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after component mounts
    setIsClient(true);
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 50);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

Date.prototype.getWeekNumber = function() {
    // ISO 8601
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    
    // Thursday in current week decides the year
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    // January 4 is always in week 1
    var week1 = new Date(date.getFullYear(), 0, 4);
    
    // Adjust to Thursday in week 1 and count number of weeks from date to week1
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

  // Only calculate time-based values on the client side
  const getTimeBasedContent = () => {
    if (!isClient) {
      return [
        "Loading...",
        "Loading...",
        "Loading...",
      ];
    }
    
    const isoDate = currentTime.toISOString().split("T");
    const week = currentTime.getWeekNumber();
    const year = currentTime.getFullYear();
    
    return [
      `It is week ${week} of the year ${year}.`,
      `Date: ${isoDate[0]}`,
      `Time: ${isoDate[1]}`,
    ];
  };

  return (
    <>
      <CookieNotice />
      
      {/* Main Content */}
      <div style={{ textAlign: "center", padding: "50px" }}>
        <TextAnim text="waldhauser.sk" />
        <Infobox
          title="Welcome to Jozef's website"
          content={getTimeBasedContent()}
        />
        <hr style={{ border: "1px solid rgb(0, 0, 71)", margin: "20px 0" }} />
        <Metrics />
        <WeatherWidget />
        
        

      </div>
    </>
  );
}