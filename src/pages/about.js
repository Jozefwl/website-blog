import "../app/globals.css";
import Navbar from "../components/navbar";
import Socialsbar from "../components/socialsbar";
import Infobox from "../components/infobox";
import Imagebox from "../components/imagebox";

export default function About() {
  return (
    <div className="min-h-screen text-gray-100 bg-black">
      <Navbar />
      <div className="container mx-auto px-6 py-10 sm:py-16 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-4">
            About Jozef Waldhauser
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            ICT Administrator | Remote Student | Tech Enthusiast
          </p>
        </div>

        <div className="space-y-8 lg:space-y-12">
        <Imagebox
            src="/images/carcrash.jpg" 
            alt="An image depicting my educational journey"
            caption="An image depicting my educational journey"
          />

          <Infobox
            title="Professional Background"
            content={[
              "Hello! I am Jozef Waldhauser, an ICT Administrator currently working at Unicorn Systems Ltd.",
              "I specialize in managing and optimizing ICT infrastructures, ensuring seamless technology operations."
            ]}
          />

          <Infobox
            title="Education"
            content={[
              "I am also a remote student at Unicorn University Ltd., focusing on Software Development.",
              "My academic background includes a magna cum laude graduation from SPŠ Snina's Technical Lyceum, where I developed skills in Cisco networking, 3D modeling, and Linux server management."
            ]}
          />

          <Infobox
            title="Experience"
            content={[
              "My professional experience spans various roles, including a part-time position as an ICT Administrator, where I ensure the operation and security of company systems.",
              "Additional things I do are manage network infrastructure, and solve complex technical issues. I also have experience as a 3D Animator, creating detailed instructional videos and optimizing rendering workflows."
            ]}
          />

          <Infobox
            title="Interests & Certifications"
            content={[
              "Beyond my technical work, I have a strong passion for electronics, 3D printing, a bit in automotive mechanics, and server management.",
              "I am proficient in multiple languages, including English at a C1 level, and have earned certifications such as Cisco's CCNA and the ECDL Certificate."
            ]}
          />

          <Infobox
            title="Let's Connect"
            content={[
              "Feel free to connect with me to discuss technology, software development, or our shared interests in servers and car culture!"
            ]}
          />
        </div>
      </div>

      <Socialsbar />

      <div className="border-t-2 border-blue-400 mt-8 sm:mt-16"></div>
    </div>
  );
}
