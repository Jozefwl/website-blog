import '../css/socialsbar.css';

const Socialsbar = () => {
  return (
    <div className="socialsbar-container">
      <a
        href="https://www.linkedin.com/in/jozef-waldhauser-337779220/"
        target="_blank"
        rel="noopener noreferrer"
        className="socialsbar-link"
      >
        <button className="socialsbar-button linkedin">
          <img className="logo" src="/logo/linkedin.png" alt="LinkedIn" />
        </button>
      </a>

      <a
        href="https://www.youtube.com/channel/UCpAI1PeZgrrca3H8JqOdMBQ"
        target="_blank"
        rel="noopener noreferrer"
        className="socialsbar-link"
      >
        <button className="socialsbar-button youtube">
          <img className="logo" src="/logo/youtube.png" alt="YouTube" />
        </button>
      </a>

      <a
        href="https://github.com/Jozefwl"
        target="_blank"
        rel="noopener noreferrer"
        className="socialsbar-link"
      >
        <button className="socialsbar-button github">
          <img className="logo" src="/logo/github.png" alt="GitHub" />
        </button>
      </a>
    </div>
  );
};

export default Socialsbar;