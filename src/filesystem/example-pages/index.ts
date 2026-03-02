import type { VirtualDirectory } from '../types';
import Page from '../../sections/Page';
import TermButtonPage from '../../sections/TermButtonPage';
import VanillaButtonPage from '../../sections/VanillaButtonPage';
import RealtimePage from '../../sections/RealtimePage';
import { readme as emptyReadme } from './empty';
import { readme as termButtonReadme } from './term-button';
import { readme as vanillaButtonReadme } from './vanilla-button';
import { readme as imageReadme } from './image';
import { readme as realtimeReadme } from './realtime';

export { default as examplePagesList } from './data';

export const examplePagesDirectories: Record<string, VirtualDirectory> = {
  'empty': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: emptyReadme },
    },
  },
  'term-button': {
    type: 'directory',
    component: TermButtonPage,
    children: {
      'README.md': { type: 'file', content: termButtonReadme },
    },
  },
  'vanilla-button': {
    type: 'directory',
    component: VanillaButtonPage,
    children: {
      'README.md': { type: 'file', content: vanillaButtonReadme },
    },
  },
  'image': {
    type: 'directory',
    component: Page,
    children: {
      'README.md': { type: 'file', content: imageReadme },
    },
  },
  'realtime': {
    type: 'directory',
    component: RealtimePage,
    children: {
      'README.md': { type: 'file', content: realtimeReadme },
    },
  },
};
