import type { VirtualDirectory } from '../types';
import Page from '../../sections/Page';
import { readme as bestReadmeTemplateReadme } from './best-readme-template';

export { default as externalMdExampleList } from './data';

export const externalMdExampleDirectories: Record<string, VirtualDirectory> = {
  'best-readme-template': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: bestReadmeTemplateReadme },
    },
  },
};
