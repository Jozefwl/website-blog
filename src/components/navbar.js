import '../css/navbar.css';
import '../app/globals.css';

export default function Navbar() {
  return (
    <nav className="navbar w-full flex justify-between p-4 font-orbitron">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  );
}