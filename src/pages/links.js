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
           <h3>
            === waldhauser.sk ===
           </h3>
           {/* <Linksbox image="https://cdn.waldhauser.sk/icons/planka.png" text="Planka" link="https://planka.waldhauser.sk"/> */}
           <Linksbox image="https://cdn.waldhauser.sk/icons/monitoring.jpg" text="Monitoring" link="https://monitoring.waldoserver.top/status/waldhauser-services"/>
           <Linksbox image="https://cdn.waldhauser.sk/icons/nodejs.png" text="Backend" link="https://metrics.waldhauser.sk"/>
           <Linksbox image="https://cdn.waldhauser.sk/icons/cdn.png" text="CDN" link="https://cdn.waldhauser.sk"/>
          <h3>
            === waldoserver.top ===
          </h3>
          <Linksbox image="https://cdn.waldhauser.sk/icons/server.png" text="Website" link="https://waldoserver.top"></Linksbox>
          <div className="spacer"></div>
          <a href="https://www.flaticon.com/free-icons/server" title="server icons">Icons created by Freepik - Flaticon</a>
      </div>
      
    </div>
    );



}