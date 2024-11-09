import Link from 'next/link';
import '../css/navbar.css';
import '../app/globals.css';

export default function Navbar() {
  return (
    <nav className="navbar w-full flex justify-between p-4 font-orbitron">
      <Link href="/" passHref>
        <a>Home</a>
      </Link>
      <Link href="/about" passHref>
        <a>About</a>
      </Link>
      <Link href="/contact" passHref>
        <a>Contact</a>
      </Link>
    </nav>
  );
}