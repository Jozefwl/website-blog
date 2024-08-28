import "../app/globals.css";
import Navbar from "../components/navbar";
import Socialsbar from "../components/socialsbar";

export default function About() {
  return (
    <div className="min-h-screen text-gray-100 bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-400 mb-4">
            About Jozef Waldhauser
          </h1>
          <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
            ICT Administrator | Remote Student | Tech Enthusiast
          </p>
        </div>

        <div className="space-y-4 sm:space-y-10 md:space-y-12">
          <div className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mt-6 sm:mt-0">
              Professional Background
            </h2>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              Hello! I am Jozef Waldhauser, an ICT Administrator currently
              working at Unicorn Systems Ltd.
            </p>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              I specialize in managing and optimizing ICT infrastructures,
              ensuring seamless technology operations.
            </p>
          </div>

          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mt-6 sm:mt-0">
              Education
            </h2>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              I am also a remote student at Unicorn University Ltd., focusing on
              Software Development.
            </p>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              My academic background includes a magna cum laude graduation from
              SPŠ Snina's Technical Lyceum, where I developed skills in Cisco
              networking, 3D modeling, and Linux server management.
            </p>
          </div>

          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mt-6 sm:mt-0">
              Experience
            </h2>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              My professional experience spans various roles, including a
              part-time position as an ICT Administrator, where I ensure the
              operation and security of company systems.
            </p>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              Additional things I do are manage network infrastructure, and
              solve complex technical issues. I also have experience as a 3D
              Animator, creating detailed instructional videos and optimizing
              rendering workflows.
            </p>
          </div>

          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mt-6 sm:mt-0">
              Interests & Certifications
            </h2>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              Beyond my technical work, I have a strong passion for electronics,
              3D printing, a bit in automotive mechanics, and server management.
            </p>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              I am proficient in multiple languages, including English at a C1
              level, and have earned certifications such as Cisco's CCNA and the
              ECDL Certificate.
            </p>
          </div>

          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-300 mt-6 sm:mt-0">
              Let's Connect
            </h2>
            <p className="mt-4 text-sm sm:text-lg leading-relaxed">
              Feel free to connect with me to discuss technology, software
              development, or our shared interests in servers and or car
              culture!
            </p>
          </div>

          <div className="border-t-2 border-blue-400 mt-8 sm:mt-16"></div>
        </div>
      </div>

      <Socialsbar />

      <div className="border-t-2 border-blue-400 mt-8 sm:mt-16"></div>
    </div>
  );
}
