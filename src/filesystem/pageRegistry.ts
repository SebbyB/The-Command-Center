import type { PageMeta } from './page-types';
import externalMdExampleList from './external-md-example/data';
import examplePagesList from './example-pages/data';
import docsList from './docs/data';
import docsToolsList from './docs/tools/data';
import { meta as theCommandCenterMeta } from './the-command-center';

// Every page that uses the Page component must be registered here.
const allPages: PageMeta[] = [
  ...externalMdExampleList,
  ...examplePagesList,
  ...docsList,
  ...docsToolsList,
  theCommandCenterMeta,
];

export const pageMap: Record<string, PageMeta> = Object.fromEntries(
  allPages.map(p => [p.name, p])
);
