import type { PageMeta } from '../page-types';

export const meta: PageMeta = {
  name: 'filesystem',
  description: 'How the virtual filesystem and page data structures work.',
  sections: [
    {
      title: 'Overview',
      body: '<p>The site uses a virtual filesystem — a plain JavaScript object tree that mirrors a Unix directory structure. The terminal interprets <code>cd</code>, <code>ls</code>, and <code>cat</code> against this tree at runtime. React components are embedded directly as properties on directory nodes, so navigating to a path automatically renders the right component.</p>',
    },
    {
      title: 'Core Types',
      body: `<p>Defined in <code>src/filesystem/types.ts</code>:</p>
<pre><code class="language-typescript">interface VirtualFile {
  type: 'file';
  content: string;
}

interface VirtualDirectory {
  type: 'directory';
  component?: ComponentType;  // React component rendered when you cd here
  description?: string;       // shown on the home screen listing
  children: Record&lt;string, VirtualNode&gt;;
}

type VirtualNode = VirtualFile | VirtualDirectory;
</code></pre>
<p>A <code>VirtualFile</code> is a leaf — its <code>content</code> string is printed by <code>cat</code>. A <code>VirtualDirectory</code> has children (more nodes) and an optional React <code>component</code> that the viewport renders when the user navigates into it.</p>`,
    },
    {
      title: 'Page Metadata',
      body: `<p>Defined in <code>src/filesystem/page-types.ts</code>:</p>
<pre><code class="language-typescript">interface PageMeta {
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
</code></pre>
<p>Each <code>.ts</code> content file exports <code>meta: PageMeta</code> and <code>readme: string</code>. The <code>readme</code> is served by <code>cat README.md</code> inside the page directory. The <code>meta</code> is consumed by the <code>Page</code> component and by <code>pageRegistry.ts</code>.</p>`,
    },
    {
      title: 'Filesystem Layout',
      body: `<pre><code>src/filesystem/
  index.ts          ← root VirtualDirectory (the ~ node)
  types.ts          ← VirtualFile / VirtualDirectory / VirtualNode types
  page-types.ts     ← PageMeta / PageSection / PageAction types
  pageRegistry.ts   ← flat map of slug → PageMeta for all pages

  &lt;section&gt;/
    data.ts         ← PageMeta[] list for this section
    index.ts        ← exports the list + VirtualDirectory children map
    &lt;slug&gt;.ts       ← one file per page: exports meta + readme

    &lt;subdir&gt;/       ← optional nested subdirectory
      data.ts
      index.ts
      &lt;slug&gt;.ts
</code></pre>`,
    },
    {
      title: 'How a Page Is Wired',
      body: `<p>When you run <code>python tools/md_to_page.py my-page.md --path docs</code>, three things are written:</p>
<ol>
<li><strong><code>src/filesystem/docs/my-page.ts</code></strong> — the content file:</li>
</ol>
<pre><code class="language-typescript">export const meta: PageMeta = { name: 'my-page', description: '...', ... };
export const readme = \`# my-page\\n\\n\${meta.description}\`;
</code></pre>
<ol>
<li><strong><code>src/filesystem/docs/data.ts</code></strong> — gains an import and array entry:</li>
</ol>
<pre><code class="language-typescript">import { meta as myPageMeta } from './my-page';
const docsList: PageMeta[] = [ myPageMeta ];
</code></pre>
<ol>
<li><strong><code>src/filesystem/docs/index.ts</code></strong> — gains an import and directory node:</li>
</ol>
<pre><code class="language-typescript">import { readme as myPageReadme } from './my-page';
export const docsDirectories = {
  'my-page': {
    type: 'directory',
    component: Page,
    children: { 'README.md': { type: 'file', content: myPageReadme } },
  },
};
</code></pre>
<p>The <code>Page</code> component looks up <code>pageMap[slug]</code> (from <code>pageRegistry.ts</code>) to get the full <code>PageMeta</code> and render the sections.</p>`,
    },
    {
      title: 'pageRegistry.ts',
      body: `<p><code>pageRegistry.ts</code> builds a flat <code>Record&lt;string, PageMeta&gt;</code> from every section's list:</p>
<pre><code class="language-typescript">import docsList from './docs/data';
import docsToolsList from './docs/tools/data';

const allPages: PageMeta[] = [ ...docsList, ...docsToolsList ];

export const pageMap: Record&lt;string, PageMeta&gt; = Object.fromEntries(
  allPages.map(p =&gt; [p.name, p])
);
</code></pre>
<p>Root-level pages (added with <code>--path /</code>) are registered individually rather than via a list:</p>
<pre><code class="language-typescript">import { meta as myPageMeta } from './my-page';
const allPages = [ myPageMeta, ...docsList, ... ];
</code></pre>`,
    },
    {
      title: 'Components and Navigation',
      body: `<p>Each <code>VirtualDirectory</code> can have a <code>component</code>. When the user runs <code>cd &lt;path&gt;</code>, the navigation context resolves the path through <code>filesystem.children</code> recursively and sets <code>currentDir</code>. The viewport then renders <code>currentDir.component</code>.</p>
<table>
<thead>
<tr>
<th>Component</th>
<th>Used for</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>Home</code></td>
<td>Root <code>~/</code> — shows the section listing</td>
</tr>
<tr>
<td><code>Page</code></td>
<td>Individual pages — renders <code>PageMeta.sections</code> as HTML</td>
</tr>
<tr>
<td><code>SubdirList</code></td>
<td>Subdirectory containers — lists child directories and pages dynamically from <code>currentDir.children</code></td>
</tr>
<tr>
<td>Section components (e.g. <code>Docs</code>)</td>
<td>Top-level sections — lists pages from their static <code>data.ts</code> list plus dynamic subdirs from <code>currentDir.children</code></td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'Adding Content',
      body: `<p>All wiring is managed by the Python tools in <code>tools/</code>. You never need to edit <code>index.ts</code>, <code>data.ts</code>, or <code>pageRegistry.ts</code> by hand.</p>
<table>
<thead>
<tr>
<th>Goal</th>
<th>Command</th>
</tr>
</thead>
<tbody>
<tr>
<td>Add a page to a section</td>
<td><code>python tools/md_to_page.py file.md --path docs</code></td>
</tr>
<tr>
<td>Add a page to the root</td>
<td><code>python tools/md_to_page.py file.md --path /</code></td>
</tr>
<tr>
<td>Add a subdirectory</td>
<td><code>python tools/add_directory.py tools --path docs</code></td>
</tr>
<tr>
<td>Add a plain file (cat-only)</td>
<td><code>python tools/add_file.py file.md --path docs</code></td>
</tr>
<tr>
<td>Remove a page</td>
<td><code>python tools/remove_page.py slug --path docs</code></td>
</tr>
</tbody>
</table>`,
    },
  ],
};

export const readme = `# filesystem

${meta.description}
`;
