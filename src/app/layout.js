import './globals.css';
import Navbar from '../components/navbar';
export const metadata = {
  title: "Waldhauser.sk",
  description: "Personal website of Jozef Waldhauser",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
<Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}