const Socialsbar = () => {
    return (
      <div className="bg-gray-800 text-center font-bold font-sans p-4 mx-auto mb-12 shadow-lg rounded-2xl max-w-fit">
        <a
          href="https://www.linkedin.com/in/jozef-waldhauser-337779220/"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-2.5"
        >
          <button className="bg-gradient-to-r from-cyan-400 to-indigo-500 text-white inline-flex items-center justify-center h-12 w-24 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 active:translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500">
            <img width="40px" height="40px" src="/logo/linkedin.png" alt="LinkedIn" />
          </button>
        </a>
  
        <a
          href="https://www.youtube.com/channel/UCpAI1PeZgrrca3H8JqOdMBQ"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-2.5"
        >
          <button className="bg-gradient-to-r from-red-500 to-red-400 text-white inline-flex items-center justify-center h-12 w-24 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 active:translate-y-1 focus:outline-none focus:ring-4 focus:ring-red-500">
            <img width="40px" height="40px" src="/logo/youtube.png" alt="YouTube" />
          </button>
        </a>
  
        <a
          href="https://github.com/Jozefwl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-gradient-to-r from-gray-400 to-gray-700 text-white inline-flex items-center justify-center h-12 w-24 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 active:translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-500">
            <img width="40px" height="40px" src="/logo/github.png" alt="GitHub" />
          </button>
        </a>
      </div>
    );
  };
  
  export default Socialsbar;