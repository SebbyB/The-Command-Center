import type { VirtualDirectory } from '../types';
import SubdirList from '../../sections/SubdirList';
import { docsToolsDirectories } from './tools';
import Page from '../../sections/Page';
import { readme as filesystemReadme } from './filesystem';

export { default as docsList } from './data';

export const docsDirectories: Record<string, VirtualDirectory> = {
  'tools': {
    type: 'directory',
    component: SubdirList,
    children: docsToolsDirectories,
  },
  'filesystem': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: filesystemReadme },
    },
  },
};
