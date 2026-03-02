import type { VirtualDirectory } from '../types';
import SubdirList from '../../sections/SubdirList';
import { docsToolsDirectories } from './tools';

export { default as docsList } from './data';

export const docsDirectories: Record<string, VirtualDirectory> = {
  'tools': {
    type: 'directory',
    component: SubdirList,
    children: docsToolsDirectories,
  },
};
