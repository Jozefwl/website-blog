import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Home is the rack itself, so it has no navbar. */}
      <Route element={<Layout showNavbar={false} />}>
        <Route index element={<Home />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        {/* Old URL from the Next.js site. */}
        <Route path="links" element={<Navigate to="/services" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
