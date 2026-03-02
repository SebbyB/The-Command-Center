import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'toggle-directory',
  description: 'Toggle a page entry between directory type and file type.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: `<p><code>toggle_directory.py</code> switches a single entry inside a section between two types:</p>
<ul>
<li><strong><code>directory</code></strong> — navigable with <code>cd</code>, appears in the section list, contains a <code>README.md</code></li>
<li><strong><code>file</code></strong> — readable with <code>cat</code>, hidden from the section list, not navigable</li>
</ul>
<p>When toggling <code>directory → file</code> the entry is also removed from <code>data.ts</code> (so it no longer appears in the section list). When toggling <code>file → directory</code> it is added back to <code>data.ts</code>.</p>
<p>Omit the slug to list all entries under a path and their current types.</p>`,
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/toggle_directory.py [&lt;slug&gt;] --path &lt;path&gt; [--dry-run]
</code></pre>
<p>Run from the project root.</p>`,
    },
    {
      title: 'Arguments',
      body: `<table>
<thead>
<tr>
<th>Argument</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>slug</code></td>
<td>no</td>
<td>Page slug to toggle. Omit to list all available entries under <code>--path</code>.</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>yes</td>
<td>Directory the page lives under. Supports nested paths (e.g. <code>experience</code>, <code>docs/tools</code>).</td>
</tr>
<tr>
<td><code>--dry-run</code></td>
<td>no</td>
<td>Print output without writing any files</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash"># List all entries and their current types
python tools/toggle_directory.py --path experience

# Toggle a specific entry
python tools/toggle_directory.py acme-job --path experience

# Preview the change without writing
python tools/toggle_directory.py acme-job --path experience --dry-run

# Inside a nested subdirectory
python tools/toggle_directory.py tree --path docs/tools
</code></pre>`,
    },
    {
      title: 'What Gets Updated',
      body: `<p><strong><code>directory → file</code>:</strong>
- <code>src/filesystem/&lt;path&gt;/index.ts</code> — multi-line block replaced with single-line file entry
- <code>src/filesystem/&lt;path&gt;/data.ts</code> — import and array entry removed</p>
<p><strong><code>file → directory</code>:</strong>
- <code>src/filesystem/&lt;path&gt;/index.ts</code> — single-line entry expanded to full directory block
- <code>src/filesystem/&lt;path&gt;/data.ts</code> — import and array entry added</p>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>Only works on entries that have no sub-entries beyond <code>README.md</code>. Entries with additional children will cause an error.</li>
<li>The backing <code>&lt;slug&gt;.ts</code> file is never modified — only the wiring in <code>index.ts</code> and <code>data.ts</code> changes.</li>
<li>After writing, run <code>npm run lint</code> to verify.</li>
</ul>`,
    },
  ],
};

export const readme = `# toggle-directory

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
