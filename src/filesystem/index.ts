import type { VirtualDirectory } from './types';
import Home from '../sections/Home';
import ExternalMdExample from '../sections/ExternalMdExample';
import { externalMdExampleDirectories } from './external-md-example';
import ExamplePages from '../sections/ExamplePages';
import { examplePagesDirectories } from './example-pages';
import Docs from '../sections/Docs';
import { docsDirectories } from './docs';
import Page from '../sections/Page';
import { readme as theCommandCenterReadme } from './the-command-center';

const filesystem: VirtualDirectory = {
  type: 'directory',
  component: Home,
  children: {
    'external-md-example': {
      type: 'directory',
      component: ExternalMdExample,
      description: '',
      children: externalMdExampleDirectories,
    },
    'example-pages': {
      type: 'directory',
      component: ExamplePages,
      description: '',
      children: examplePagesDirectories,
    },
    'docs': {
      type: 'directory',
      component: Docs,
      description: '',
      children: docsDirectories,
    },
    'the-command-center': {
      type: 'directory',
      component: Page,
      children: {
        'README.md': { type: 'file', content: theCommandCenterReadme },
      },
    },
  },
};

export default filesystem;
export type { VirtualFile, VirtualDirectory, VirtualNode } from './types';
