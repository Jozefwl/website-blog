import "../app/globals.css";
import "../css/links.css";
import Navbar from "../components/navbar";
import Linksbox from "../components/linksbox";
import CookieNotice from "../components/cookienotice";
import TextAnim from "../components/animatedtext";
import { useState } from "react";

export default function Links() {






    return(
    <div>
        <div>
      <CookieNotice></CookieNotice>
      <Navbar />      
      
      </div>
      
      <div className="links-container">
           <TextAnim text="Links/Services" />
           <Linksbox image="https://cdn.waldhauser.sk/icons/grafana.png" text="Grafana" link="https://grafana.waldhauser.sk"/>
           <Linksbox image="https://cdn.waldhauser.sk/icons/nextcloud.png" text="Nextcloud" link="https://cloud.waldhauser.sk"/>
           <Linksbox image="https://cdn.waldhauser.sk/icons/planka.png" text="Planka" link="https://planka.waldhauser.sk"/>
           <Linksbox image="https://cdn.waldhauser.sk/icons/monitoring.jpg" text="Monitoring" link="https://stats.uptimerobot.com/kmCYs70MbD"/>
           <Linksbox image="https://cdn.waldhauser.sk/icons/nodejs.png" text="Backend" link="https://metrics.waldhauser.sk"/>
      </div>
    </div>
    );



}