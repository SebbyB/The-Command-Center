---
name: filesystem
description: How the virtual filesystem and page data structures work.
---

## Overview

The site uses a virtual filesystem — a plain JavaScript object tree that mirrors a Unix directory structure. The terminal interprets `cd`, `ls`, and `cat` against this tree at runtime. React components are embedded directly as properties on directory nodes, so navigating to a path automatically renders the right component.

## Core Types

Defined in `src/filesystem/types.ts`:

```typescript
interface VirtualFile {
  type: 'file';
  content: string;
}

interface VirtualDirectory {
  type: 'directory';
  component?: ComponentType;  // React component rendered when you cd here
  description?: string;       // shown on the home screen listing
  children: Record<string, VirtualNode>;
}

type VirtualNode = VirtualFile | VirtualDirectory;
```

A `VirtualFile` is a leaf — its `content` string is printed by `cat`. A `VirtualDirectory` has children (more nodes) and an optional React `component` that the viewport renders when the user navigates into it.

## Page Metadata

Defined in `src/filesystem/page-types.ts`:

```typescript
interface PageMeta {
  name: string;          // slug — must match the directory key in the filesystem
  description: string;   // one-line summary
  tech?: string[];       // technology tags
  repo?: string;         // source repo URL
  live?: string;         // live deployment URL
  sections?: PageSection[]; // body rendered by the Page component
  action?: PageAction;   // optional terminal button
}

interface PageSection {
  title: string;
  body: string; // HTML string
}
```

Each `.ts` content file exports `meta: PageMeta` and `readme: string`. The `readme` is served by `cat README.md` inside the page directory. The `meta` is consumed by the `Page` component and by `pageRegistry.ts`.

## Filesystem Layout

```
src/filesystem/
  index.ts          ← root VirtualDirectory (the ~ node)
  types.ts          ← VirtualFile / VirtualDirectory / VirtualNode types
  page-types.ts     ← PageMeta / PageSection / PageAction types
  pageRegistry.ts   ← flat map of slug → PageMeta for all pages

  <section>/
    data.ts         ← PageMeta[] list for this section
    index.ts        ← exports the list + VirtualDirectory children map
    <slug>.ts       ← one file per page: exports meta + readme

    <subdir>/       ← optional nested subdirectory
      data.ts
      index.ts
      <slug>.ts
```

## How a Page Is Wired

When you run `python tools/md_to_page.py my-page.md --path docs`, three things are written:

1. **`src/filesystem/docs/my-page.ts`** — the content file:
```typescript
export const meta: PageMeta = { name: 'my-page', description: '...', ... };
export const readme = `# my-page\n\n${meta.description}`;
```

2. **`src/filesystem/docs/data.ts`** — gains an import and array entry:
```typescript
import { meta as myPageMeta } from './my-page';
const docsList: PageMeta[] = [ myPageMeta ];
```

3. **`src/filesystem/docs/index.ts`** — gains an import and directory node:
```typescript
import { readme as myPageReadme } from './my-page';
export const docsDirectories = {
  'my-page': {
    type: 'directory',
    component: Page,
    children: { 'README.md': { type: 'file', content: myPageReadme } },
  },
};
```

The `Page` component looks up `pageMap[slug]` (from `pageRegistry.ts`) to get the full `PageMeta` and render the sections.

## pageRegistry.ts

`pageRegistry.ts` builds a flat `Record<string, PageMeta>` from every section's list:

```typescript
import docsList from './docs/data';
import docsToolsList from './docs/tools/data';

const allPages: PageMeta[] = [ ...docsList, ...docsToolsList ];

export const pageMap: Record<string, PageMeta> = Object.fromEntries(
  allPages.map(p => [p.name, p])
);
```

Root-level pages (added with `--path /`) are registered individually rather than via a list:

```typescript
import { meta as myPageMeta } from './my-page';
const allPages = [ myPageMeta, ...docsList, ... ];
```

## Components and Navigation

Each `VirtualDirectory` can have a `component`. When the user runs `cd <path>`, the navigation context resolves the path through `filesystem.children` recursively and sets `currentDir`. The viewport then renders `currentDir.component`.

| Component | Used for |
|---|---|
| `Home` | Root `~/` — shows the section listing |
| `Page` | Individual pages — renders `PageMeta.sections` as HTML |
| `SubdirList` | Subdirectory containers — lists child directories and pages dynamically from `currentDir.children` |
| Section components (e.g. `Docs`) | Top-level sections — lists pages from their static `data.ts` list plus dynamic subdirs from `currentDir.children` |

## Adding Content

All wiring is managed by the Python tools in `tools/`. You never need to edit `index.ts`, `data.ts`, or `pageRegistry.ts` by hand.

| Goal | Command |
|---|---|
| Add a page to a section | `python tools/md_to_page.py file.md --path docs` |
| Add a page to the root | `python tools/md_to_page.py file.md --path /` |
| Add a subdirectory | `python tools/add_directory.py tools --path docs` |
| Add a plain file (cat-only) | `python tools/add_file.py file.md --path docs` |
| Remove a page | `python tools/remove_page.py slug --path docs` |
