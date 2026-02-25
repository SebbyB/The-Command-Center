import type { PageMeta } from './types';
import { meta as portfolioSiteMeta } from './portfolio-site';

// Add new project metas here. No component imports — this file must stay cycle-free.
const projectList: PageMeta[] = [
  portfolioSiteMeta,
];

export default projectList;
