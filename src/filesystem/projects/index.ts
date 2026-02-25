import type { VirtualDirectory } from '../types';
import { meta as portfolioSiteMeta, readme as portfolioSiteReadme } from './portfolio-site';
import Page from '../../sections/Page';

export { default as projectList } from './data';

export const projectDirectories: Record<string, VirtualDirectory> = {
  'portfolio-site': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: portfolioSiteReadme },
    },
  },
};
