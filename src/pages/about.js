import "../app/globals.css";
import Navbar from "../components/navbar";
import Socialsbar from "../components/socialsbar";
import Infobox from "../components/infobox";
import Imagebox from "../components/imagebox";
import CookieNotice from "../components/cookienotice";

export default function About() {
  const src = [
    "/images/moher.jpg",
    "/images/oravaCastle.jpg",
    "/images/sulovskeSkalyView.jpg",
    "/images/winter.jpg",
    "/images/oborinTrail.jpg",
    "/images/oborinTrailDragonfly.jpg",
    "/images/zborovskyCastle.jpg",
    "/images/starina.jpg",
    "/images/snina_hill.jpg",
    "/images/pustyHrad.jpg",
    "/images/presovUnderpass.jpg",
    "/images/italy.jpg",
  ];
  const alt = [
    "An image of the Cliffs of Moher, shot from the direction looking away from the little castle on the hill",
    "An image of Orava Castle, view from the top of the castle",
    "An image of the view from Súľovské Skaly, which I took in Slovakia",
    "An image of a white Winter road between Stakčín and Ubľa",
    "An image of the slovakian Oborin Trail, gray gravel path with green forest surrounding it",
    "An image of a dragonfly on Oborin Trail, which I took in Slovakia",
    "An image of Zborovský Castle, scaffolding can be seen from the inside of the castle",
    "An image of Starina, the water reservoir which was taken in a little hilltop 'observatory'",
    "An image of my home town, this is a view from a bit further away, at the enterance sign to Snina driving from Belá, but in the forest, circa 1-2km air distance from sign",
    "An image of the view from Pustý Castle, which I took in Slovakia, brown forest and some rocks can be seen",
    "An image of Prešov, some random graffiti'd underpass",
    "An image I took in italy, can't remember where",
  ];
  const caption = [
    "Cliffs of Moher, Ireland",
    "Oravský hrad, Slovakia",
    "View from Súľovské skaly, Slovakia",
    "Winter road between Stakčín and Ubľa, Slovakia",
    "Oborín Trail, Slovakia",
    "Dragonfly on Oborín Trail, Slovakia",
    "Zborovský hrad, Slovakia",
    "Water reservoir Starina, Slovakia",
    "Snina, Slovakia",
    "View from Pustý hrad, Slovakia",
    "Prešov, Slovakia",
    "Somewhere, Italy",
  ];
  return (
    <> <CookieNotice />
    <div className="min-h-screen text-gray-100 bg-black">
      <Navbar />
      <div className="container mx-auto px-6 py-10 sm:py-16 lg:px-8">
        <div className="text-center mb-12">
          <div className="separateMe">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-4">
              About Jozef Waldhauser
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Self-Proclaimed &ldquo;IT Guy&ldquo; | Student | Tech enjoyer
          </p>
        </div>

        <div className="space-y-8 lg:space-y-12">
          <Imagebox srcArray={src} altArray={alt} captionArray={caption} />

          <Infobox
            title="Professional Background"
            content={[
              "I started working as SLS support",
              "Currently employed as an Configuration Manager at Unicorn Systems",
              "I help manage and deploy the Unicorn Enterprise Platform.",
            ]}
          />

          <Infobox
            title="Interests"
            content={[
              "Servers, computers, hardware, audio equipment, 3d printing, 3d modelling, CAD modelling, electronics, soldering, welding, drawing, singing, hikes, airsoft, history.",
              "Native Slovak, spoke English my whole life, tiny bit of German and and OK Russian.",
              "I am currently trying to get better at automation, kubernetes and programming.",
            ]}
          />

          <Infobox
            title="Let's Connect"
            content={["Pretty buttons from Town X near you ↓"]}
          />
        </div>
      </div>

      <Socialsbar />

      <div className="border-t-2 border-blue-400 mt-8 sm:mt-16"></div>
    </div>
    </>
  );
}
