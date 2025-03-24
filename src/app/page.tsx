import Hero from "@/components/Hero";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Benefits from "@/components/Benefits/Benefits";
import FAQ from "@/components/FAQ";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import Events from "@/components/Events/Events";
// import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";
import Leadership from "@/components/Leadership";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <TechStack />
      <Container>
        <Benefits />

        <Section
          id="leadership"
          title="Club Leadership"
          description="Meet the team behind Newman Coding Club"
        >
          <Leadership />
        </Section>

        <Section
          id="events"
          title="Upcoming Events"
          description="Join us for these exciting opportunities to learn and connect."
        >
          <Events />
        </Section>

        {/* <Section
          id="projects"
          title="Our Projects"
          description="See what our members have been working on."
        >
          <Projects />
        </Section> */}

        <FAQ />

        <Stats />
        
        <CTA />
      </Container>
    </>
  );
};

export default HomePage;