"use client";

import React, { useState } from "react";
import "../css/weather.css";

const WeatherWidget = ({ isExpanded: initialExpanded = false }) => {
  // State to toggle the visibility of the widgets
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Toggle function to expand or collapse the widget
  const toggleWidget = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <>
      <button className="expand-button" onClick={toggleWidget}>
        {isExpanded ? "Collapse Weather" : "Expand Weather"}
      </button>
      <div className="weather-container">
        {isExpanded && (
          <div className="weather-widgets">
            <div className="weather-container">
              <div className="weather-widget">
                <iframe
                  src="https://www.meteoblue.com/sk/po%C4%8Dasie/widget/daily/snina_slovensko_723559?geoloc=fixed&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=0&humidity=0&precipitation=1&precipitationprobability=1&spot=1&pressure=0&layout=light"
                  frameBorder="0"
                  scrolling="NO"
                  allowtransparency="true"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  style={{ width: "216px", height: "420px" }}
                ></iframe>
                <div>
                  <a
                    href="https://www.meteoblue.com/sk/po%C4%8Dasie/t%C3%BD%C5%žde%C5%ň/snina_slovensko_723559?utm_source=daily_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget"
                    target="_blank"
                    rel="noopener"
                    style={{ color: "white" }}
                  >
                    meteoblue
                  </a>
                </div>
              </div>

              <div className="weather-widget">
                <iframe
                  src="https://www.meteoblue.com/sk/po%C4%8Dasie/widget/daily/pre%c5%a1ov_slovensko_723819?geoloc=fixed&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=0&humidity=0&precipitation=1&precipitationprobability=1&spot=1&pressure=0&layout=light"
                  frameBorder="0"
                  scrolling="NO"
                  allowtransparency="true"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  style={{ width: "216px", height: "420px" }}
                ></iframe>
                <div>
                  <a
                    href="https://www.meteoblue.com/sk/po%C4%8Dasie/t%C3%BD%C5%žde%C5%ň/pre%c5%a1ov_slovensko_723819?utm_source=daily_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget"
                    target="_blank"
                    rel="noopener"
                    style={{ color: "white" }}
                  >
                    meteoblue
                  </a>
                </div>
              </div>

              <div className="weather-widget">
                <iframe
                  src="https://www.meteoblue.com/sk/po%C4%8Dasie/widget/daily/praha_%C4%8Desk%C3%A1-republika_3067696?geoloc=fixed&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&precipunit=MILLIMETER&coloured=coloured&pictoicon=1&maxtemperature=1&mintemperature=1&windspeed=1&windgust=0&winddirection=1&uv=0&humidity=0&precipitation=1&precipitationprobability=1&spot=1&pressure=0&layout=light"
                  frameBorder="0"
                  scrolling="NO"
                  allowtransparency="true"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  style={{ width: "216px", height: "420px" }}
                ></iframe>
                <div>
                  <a
                    href="https://www.meteoblue.com/sk/po%C4%8Dasie/t%C3%BD%C5%BEde%C5%88/praha_%C4%8Desk%C3%A1-republika_3067696?utm_source=daily_widget&utm_medium=linkus&utm_content=daily&utm_campaign=Weather%2BWidget"
                    target="_blank"
                    rel="noopener"
                    style={{ color: "white" }}
                  >
                    meteoblue
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherWidget;
