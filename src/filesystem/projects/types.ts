export interface PageSection {
  title: string;
  body: string;
  image?: string; // local import or external URL
}

export interface PageMeta {
  name: string;
  description: string;
  tech?: string[];
  repo?: string;
  live?: string;
  sections?: PageSection[];
}
