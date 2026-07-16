import Home from '@/components/sections/Home';
import Events from '@/components/sections/Events';
import Gallery from '@/components/sections/Gallery';
import Projects from '@/components/sections/Projects';
import Merch from '@/components/sections/Merch';
import Tools from '@/components/sections/Tools';
import Contact from '@/components/sections/Contact';
import About from '@/components/sections/About';

// The section ORDER lives in exactly one visible place (and must match
// content/sections.ts, which drives the nav, gauge and planets).
export default function Page() {
  return (
    <>
      <Home />
      <Events />
      <Gallery />
      <Projects />
      <Merch />
      <Tools />
      <Contact />
      <About />
    </>
  );
}
