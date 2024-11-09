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
            ICT Administrator | Remote Student | Tech Enthusiast
          </p>
        </div>

        <div className="space-y-8 lg:space-y-12">
        <Imagebox srcArray={src} altArray={alt} captionArray={caption} />

          <Infobox
            title="Professional Background"
            content={[
              "Hello! I am Jozef Waldhauser, an ICT Administrator currently working at Unicorn Systems Ltd.",
              "My main job is to ensure company applications are working properly, and deploying new production versions of applications.",
              "The second part of my job is being a configuration manager, where I work for multiple projects."
            ]}
          />

          <Infobox
            title="Education"
            content={[
              "I am also a remote student at Unicorn University Ltd., focusing on Software Development.",
              "My academic background includes a magna cum laude graduation from SPŠ Snina."
            ]}
          />

          <Infobox
            title="Experience"
            content={[
              "I have worked as second line support for over a year now, where I can safely say I have gained a lot of experience in the field.",
              "My work as a configuration manager has shown me more insight into what truly lies behind our company infrastructure."
            ]}
          />

          <Infobox
            title="Interests & Certifications"
            content={[
              "My interests include computer hardware, servers, gaming and a tiny bit in car culture.",
              "As a bilingual I can write and speak in Slovak and English perfectly. I know the basics of Russian and German."
            ]}
          />

          <Infobox
            title="Let's Connect"
            content={[
              "Feel free to connect with me to discuss anything!"
            ]}
          /> 
        </div>
      </div>

      <Socialsbar />

      <div className="border-t-2 border-blue-400 mt-8 sm:mt-16"></div>
    </div>
  );
}
