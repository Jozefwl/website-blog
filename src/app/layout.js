import './globals.css';
import Navbar from '../components/navbar';
export const metadata = {
  title: "Waldhauser.sk",
  description: "Created using Next.js",
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