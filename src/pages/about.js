import "../app/globals.css";
import Navbar from "../components/navbar";
import Socialsbar from "../components/socialsbar";
import Infobox from "../components/infobox";
import Imagebox from "../components/imagebox";

export default function About() {
  const src=["/images/moher.jpg",
    "/images/oravaCastle.jpg",
    "/images/sulovskeSkalyView.jpg",
    "/images/winter.jpg",
    "/images/oborinTrail.jpg",
    "/images/oborinTrailDragonfly.jpg",
    "/images/zborovskyCastle.jpg",
    "/images/starina.jpg",
  ]
  const alt=["An image of Cliffs of Moher, which I took Ireland",
    "An image of Orava Castle, which I took in Slovakia",
    "An image of the view from Súľovské Skaly, which I took in Slovakia",
    "An image of Winter road between Stakčín and Ubľa, which I took in Slovakia",
  "An image of Oborin Trail, which I took in Slovakia",
"An image of a dragonfly on Oborin Trail, which I took in Slovakia",
"An image of Zborovský Castle, which I took in Slovakia",
"An image of Starina, which I took in Slovakia",
]
  const caption=["Cliffs of Moher, Ireland",
    "Orava Castle, Slovakia",
    "View from Súľovské skaly, Slovakia",
    "Winter road between Stakčín and Ubľa, Slovakia",
  "Oborin Trail, Slovakia",
"Dragonfly on Oborin Trail, Slovakia",
"Zborovský Castle, Slovakia",
"Water reservoir Starina, Slovakia",

  ]
  return (
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
              "Currently emplyoed as an ICT Admin at Unicorn Systems",
              "I help our team manage some over 150 apps.",
              "Recently I also started doing config management.",
              "I have had a job for almost 2 years now."
            ]}
          />

          <Infobox
            title="Interests"
            content={[
              "Servers, computers, hardware (2025 kinda meh but still), audio equipment, 3d printing, 3d modelling, CAD modelling, electronics, soldering, welding, drawing, singing, hikes, airsoft, history, recently politics (believe it or not).",
              "Native Slovak, spoke English my whole life, tiny bit of German and not great not terrible Russian.",
              "I like making new things, but when it comes to programming I think of it as lego, not as carving wood."
            ]}
          />

          <Infobox
            title="Let's Connect"
            content={[
              "Pretty buttons from Town X near you ↓",
            ]}
          /> 
        </div>
      </div>

      <Socialsbar />

      <div className="border-t-2 border-blue-400 mt-8 sm:mt-16"></div>
    </div>
  );
}
