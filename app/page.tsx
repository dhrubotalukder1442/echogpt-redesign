import Navbar from "@/components/Navbar";
import FAQ from "@/components/FAQ";
import ExtensionSection from "@/components/ExtensionSection";
import Footer from "@/components/Footer";
import {
  Hero,
  Models,
  Features,
  Preview,
  Why,
  Pricing,
  CTA,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <Models />
        <Features />
        <Preview />
        <ExtensionSection />
        <Why />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}