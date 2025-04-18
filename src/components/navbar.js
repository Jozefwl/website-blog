import Link from 'next/link';
import '../css/navbar.css';
import '../app/globals.css';

export default function Navbar() {
  return (
    <nav className="navbar w-full flex justify-between p-4 font-orbitron">
      <Link href="/" passHref>
        Home
      </Link>
      <Link href="/about" passHref>
        About
      </Link>
      <Link href="/contact" passHref>
        Contact
      </Link>
    </nav>
  );
}