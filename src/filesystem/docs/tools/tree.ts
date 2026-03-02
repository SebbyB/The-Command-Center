import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'tree',
  description: 'Display the virtual filesystem structure of the portfolio site.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>tree.py</code> prints a visual tree of every section and page currently wired into the portfolio site\'s virtual filesystem. It reads the live TypeScript source files to reflect the exact state of the filesystem, including whether entries are <code>directory</code> or <code>file</code> type.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/tree.py
</code></pre>
<p>Run from the project root. No arguments required.</p>`,
    },
    {
      title: 'Example Output',
      body: `<pre><code>~
├── about.txt
├── skills.json
├── projects/
│   ├── command-center/
│   │   └── README.md
│   └── side-project/
│       └── README.md
├── experience/
│   ├── acme-corp/
│   │   └── README.md
│   └── old-job  (file)
└── contact/
</code></pre>
<p>Directory entries are shown with a trailing <code>/</code> and their <code>README.md</code> child. File-type entries are shown as plain names.</p>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>The tree reflects the actual contents of <code>src/filesystem/index.ts</code> and each section's <code>index.ts</code> — it always shows the current state.</li>
<li>Root-level files and sections are read from <code>src/filesystem/index.ts</code>.</li>
<li>Per-section entries are discovered from each section's <code>index.ts</code>.</li>
<li>The <code>--tree</code> flag available on <code>add_page.py</code>, <code>add_directory.py</code>, <code>add_file.py</code>, <code>remove_page.py</code>, <code>remove_directory.py</code>, and <code>remove_file.py</code> calls this same renderer after their operation completes.</li>
</ul>`,
    },
  ],
};

export const readme = `# tree

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
