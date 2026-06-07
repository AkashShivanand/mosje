// Content structures observed on the dosje.gov.in homepage.

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeroSlide {
  image: string;
  alt: string;
  href?: string;
}

export interface UpdateItem {
  category: string; // e.g. "Documents"
  title: string;
  date?: string;
  href: string;
}

export interface OfferingCard {
  title: string;
  description?: string;
  image?: string;
  href: string;
}

export interface OrganisationCard {
  name: string;
  logo: string;
  href: string;
}

export interface DocumentItem {
  title: string;
  date: string;
  thumbnail?: string;
  href: string;
}

export interface PersonCard {
  name: string;
  designation: string;
  photo: string;
}

export interface SocialPlatform {
  name: string;
  href: string;
  icon: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}
