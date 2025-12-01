import About from "../components/About";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import TestimonialsSection from "../components/TestimonialsSection";

export default function Home() {
    return (
        <main>
            <Hero />
            <About />
            <Gallery />
            <TestimonialsSection />
        </main>
    );
}
