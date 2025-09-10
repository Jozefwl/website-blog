import "../css/links.css";
import "../app/globals.css";

export default function Linksbox({ image, text, link }) {
  return (
    <>
      <div className="linksbox">
        <a href={link}>
          <div className="leftimage-linktext-row">
            <img className="leftimage" src={image} alt="icon" />
            <div className="linktext">{text}</div>
          </div>
        </a>
      </div>
    </>
  );
}
