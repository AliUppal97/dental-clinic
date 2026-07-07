export interface ClinicGeo {
  latitude: number;
  longitude: number;
}

export interface ClinicAddress {
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
}

export interface ClinicHours {
  day: string;
  time: string;
}

export interface ClinicSocials {
  instagram: string;
  facebook: string;
  linkedin: string;
  googleBusinessProfile: string;
}

export interface ClinicStat {
  label: string;
  value: string;
}

export interface HeroImage {
  src: string;
  alt: string;
}

export interface Clinic {
  name: string;
  labName: string;
  tagline: string;
  description: string;
  logoPath: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: ClinicAddress;
  geo?: ClinicGeo;
  priceRange?: string;
  hours: ClinicHours[];
  socials: ClinicSocials;
  stats: ClinicStat[];
  heroImage: HeroImage;
}

export interface Theme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

export interface ServicesSection {
  eyebrow: string;
  heading: string;
  intro: string;
}

export interface AboutSection {
  eyebrow: string;
  heading: string;
  teamHeading: string;
  whyChooseUsHeading: string;
}

export interface LaboratorySection {
  eyebrow: string;
  heading: string;
  intro: string;
  processHeading: string;
  photosHeading: string;
}

export interface GallerySection {
  eyebrow: string;
  heading: string;
  intro: string;
  beforeAfterHeading: string;
}

export interface TestimonialsSection {
  eyebrow: string;
  heading: string;
  intro: string;
}

export interface FaqsSection {
  eyebrow: string;
  heading: string;
  intro: string;
}

export interface ContactSection {
  eyebrow: string;
  heading: string;
  intro: string;
  formHeading: string;
  formIntro: string;
  responseNote: string;
  trustPoints: string[];
}

export interface Sections {
  services: ServicesSection;
  about: AboutSection;
  laboratory: LaboratorySection;
  gallery: GallerySection;
  testimonials: TestimonialsSection;
  faqs: FaqsSection;
  contact: ContactSection;
}

export interface LabProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ReferringDentists {
  enabled: boolean;
  heading: string;
  description: string;
}

export interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  photoPath?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface BeforeAfterCase {
  beforeSrc: string;
  afterSrc: string;
  caption: string;
}

export interface Testimonial {
  name: string;
  rating: number;
  quote: string;
}

export interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export interface Certification {
  name: string;
  iconPath: string;
}

export interface SiteData {
  clinic: Clinic;
  theme: Theme;
  sections: Sections;
  whyChooseUs: Differentiator[];
  labProcess: LabProcessStep[];
  labPhotos: GalleryImage[];
  referringDentists: ReferringDentists;
  servicesClinic: Service[];
  servicesLab: Service[];
  doctors: Doctor[];
  gallery: GalleryImage[];
  beforeAfterConsent: boolean;
  beforeAfter: BeforeAfterCase[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  certifications: Certification[];
}
