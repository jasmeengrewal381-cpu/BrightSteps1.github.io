
import React from 'react';
import {
  Heart,
  Compass,
  UsersRound,
  ShieldCheck,
} from 'lucide-react';

import { PageHero, SectionHeading } from '../components/Layout';
import { CTASection } from '../components/Shared';

import about from '../images/about.JPG';
import child from '../images/child.JPG';
const values = [
  {
    icon: <Heart />,
    title: 'Dignity first',
    text: 'Every child deserves respect, patience and the freedom to be themselves.',
  },
  {
    icon: <UsersRound />,
    title: 'Families are partners',
    text: 'Parents and caregivers are important members of every support team.',
  },
  {
    icon: <Compass />,
    title: 'Individual pathways',
    text: 'We adapt our approach to a child’s strengths, needs and goals.',
  },
  {
    icon: <ShieldCheck />,
    title: 'Thoughtful, safe care',
    text: 'We aim for a welcoming environment where children feel secure and heard.',
  },
];

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        eyebrow="Who we are"
        title={
          <>
            Care that begins with <em>understanding.</em>
          </>
        }
        text="BrightSteps is a specialised children's care and development centre supporting children with disabilities and additional developmental needs through personalised therapy, rehabilitation and family partnership."
        image={child}
        imageAlt="A family sharing a supportive moment"
      />

      {/* Our Purpose Section */}
      <section className="section">
        <div className="container story-grid">
          <div className="story-image">
            <img
              src={about}
              alt="Child participating in therapy"
            />

            <span className="image-caption">
              Listen. Understand. Support.
            </span>
          </div>

          <div>
            <SectionHeading
              eyebrow="Our purpose"
              title="A more supported journey for every family"
              text="Finding the right support can feel overwhelming. We want families to have a place where questions are welcome, differences are respected and plans are made together."
            />

            <p className="body-copy">
              Our work brings together developmental support,
              therapeutic services and practical guidance in a
              coordinated setting. We focus on participation,
              communication, movement, daily living skills and
              wellbeing — always recognising that each child’s
              needs and pace are different.
            </p>

            <p className="body-copy">
              BrightSteps is designed to work alongside families
              and, where appropriate, a child’s existing
              healthcare and education professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="What guides us"
            title="The values behind every small step"
            text="These principles shape the way we welcome children, work with families and think about progress."
            center
          />

          <div className="values-grid">
            {values.map((value, index) => (
              <article
                className="value-card"
                key={value.title}
              >
                <div className={`value-icon value-${index}`}>
                  {value.icon}
                </div>

                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="section mission-section">
        <div className="container mission-grid">
          <div className="mission-quote">
            <span className="quote-mark">“</span>

            <blockquote>
              Children don’t need to fit one mould. Support
              should make room for who they are.
            </blockquote>

            <span className="quote-attribution">
              The BrightSteps care philosophy
            </span>
          </div>

          <div className="mission-points">
            <div>
              <span className="mission-number">01</span>
              <h3>Our mission</h3>

              <p>
                To provide respectful, individualised
                developmental care that helps children
                participate, connect and build everyday skills.
              </p>
            </div>

            <div>
              <span className="mission-number">02</span>
              <h3>Our vision</h3>

              <p>
                A community where children with disabilities
                are welcomed, understood and supported to
                explore their own possibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <CTASection />
    </>
  );
}
