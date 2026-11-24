/** Organisation constants + JSON-LD. Kept dependency-free so any page can import it cheaply. */
export const SITE_URL = "https://www.theconsistentacademy.in";
export const SITE_NAME = "The Consistent Academy";

export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo2.png`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "IELTS preparation, business communication, corporate training, interview coaching, leadership programmes and kids' public speaking courses, in Pune and online.",
  telephone: "+91-77091-09830",
  email: "theconsistentacademy@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  sameAs: [
    "https://www.instagram.com/the_consistent_academy/",
    "https://www.linkedin.com/company/the-consistent-academy/",
  ],
};
