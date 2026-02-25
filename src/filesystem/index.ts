import type { VirtualDirectory } from './types';
import { projectDirectories } from './projects';
import Home from '../sections/Home';
import Projects from '../sections/Projects';
import Page from '../sections/Page';
import aboutContent from './files/about';
import skillsContent from './files/skills';

const filesystem: VirtualDirectory = {
  type: 'directory',
  component: Home,
  children: {
    'about.txt':   { type: 'file', content: aboutContent },
    'skills.json': { type: 'file', content: skillsContent },
    projects: {
      type: 'directory',
      component: Projects,
      description: 'A collection of things I have built.',
      children: projectDirectories,
    },
    experience: {
      type: 'directory',
      component: Page,
      description: 'Where I have worked and what I have done.',
      children: {},
    },
    education: {
      type: 'directory',
      component: Page,
      description: 'Academic background and certifications.',
      children: {},
    },
    contact: {
      type: 'directory',
      component: Page,
      description: 'Get in touch.',
      children: {},
    },
  },
};

export default filesystem;
export type { VirtualFile, VirtualDirectory, VirtualNode } from './types';
