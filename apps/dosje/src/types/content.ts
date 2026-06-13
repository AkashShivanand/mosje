export interface ContentSection {
  heading: string | null;
  html: string;
}

export interface SectionRecord {
  slug: string;
  title: string;
  sourceUrl: string;
  sections: ContentSection[];
  featuredImage?: string;
  website?: string;
  category?: string;
  targetGroup?: string[];
}
