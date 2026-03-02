import type { VirtualDirectory } from '../../types';
import Page from '../../../sections/Page';
import { readme as addCommandReadme } from './add-command';
import { readme as addDirectoryReadme } from './add-directory';
import { readme as addFileReadme } from './add-file';
import { readme as addPageReadme } from './add-page';
import { readme as removePageReadme } from './remove-page';
import { readme as removeCommandReadme } from './remove-command';
import { readme as removeDirectoryReadme } from './remove-directory';
import { readme as removeFileReadme } from './remove-file';
import { readme as treeReadme } from './tree';
import { readme as whoamiReadme } from './whoami';
import { readme as mdToPageReadme } from './md-to-page';

export { default as docsToolsList } from './data';

export const docsToolsDirectories: Record<string, VirtualDirectory> = {
  'add-command': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: addCommandReadme },
    },
  },
  'add-directory': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: addDirectoryReadme },
    },
  },
  'add-file': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: addFileReadme },
    },
  },
  'add-page': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: addPageReadme },
    },
  },
  'remove-page': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: removePageReadme },
    },
  },
  'remove-command': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: removeCommandReadme },
    },
  },
  'remove-directory': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: removeDirectoryReadme },
    },
  },
  'remove-file': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: removeFileReadme },
    },
  },
  'tree': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: treeReadme },
    },
  },
  'whoami': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: whoamiReadme },
    },
  },
  'md-to-page': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: mdToPageReadme },
    },
  },
};
