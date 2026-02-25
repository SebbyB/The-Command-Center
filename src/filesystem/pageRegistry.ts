import type { PageMeta } from './projects/types';
import projectList from './projects/data';
import { meta as experienceMeta } from './experience';
import { meta as educationMeta } from './education';
import { meta as contactMeta } from './contact';

// Every page that uses the Page component must be registered here.
const allPages: PageMeta[] = [
  ...projectList,
  experienceMeta,
  educationMeta,
  contactMeta,
];

export const pageMap: Record<string, PageMeta> = Object.fromEntries(
  allPages.map(p => [p.name, p])
);
