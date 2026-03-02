import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'remove-directory',
  description: 'Remove a section directory (top-level or nested) from the virtual filesystem.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>remove_directory.py</code> reverses what <code>add_directory.py</code> did. Without <code>--path</code> it removes a top-level section: deletes the entire folder, the React component, and all wiring. With <code>--path</code> it removes a subdirectory: cleans the parent <code>index.ts</code> and <code>pageRegistry.ts</code> and deletes the folder — no <code>.tsx</code> file is touched.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code># Top-level section
python tools/remove_directory.py &lt;name&gt; [--dry-run]

# Subdirectory inside an existing section
python tools/remove_directory.py &lt;name&gt; --path &lt;parent&gt; [--dry-run]
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
<td><code>name</code></td>
<td>yes</td>
<td>Directory slug to remove (e.g. <code>blog</code>, <code>tools</code>)</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>no</td>
<td>Parent path for subdirectory removal (e.g. <code>docs</code>, <code>docs/tools</code>). Omit to remove a top-level section.</td>
</tr>
<tr>
<td><code>--dry-run</code></td>
<td>no</td>
<td>Print what would be removed without modifying any files</td>
</tr>
<tr>
<td><code>--tree</code></td>
<td>no</td>
<td>Print the virtual filesystem tree after the operation</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'What Gets Removed (top-level, no --path)',
      body: `<table>
<thead>
<tr>
<th>File / Directory</th>
<th>Action</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>src/filesystem/&lt;name&gt;/</code></td>
<td>Deleted (entire directory with all contents)</td>
</tr>
<tr>
<td><code>src/sections/&lt;Name&gt;.tsx</code></td>
<td>Deleted</td>
</tr>
<tr>
<td><code>src/filesystem/index.ts</code></td>
<td>Import lines and children entry block removed</td>
</tr>
<tr>
<td><code>src/filesystem/pageRegistry.ts</code></td>
<td>Import line and spread entry removed</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'What Gets Removed (subdirectory, with --path)',
      body: `<table>
<thead>
<tr>
<th>File / Directory</th>
<th>Action</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>src/filesystem/&lt;parent&gt;/&lt;name&gt;/</code></td>
<td>Deleted (entire directory with all contents)</td>
</tr>
<tr>
<td><code>src/filesystem/&lt;parent&gt;/index.ts</code></td>
<td>Import and entry block removed</td>
</tr>
<tr>
<td><code>src/filesystem/pageRegistry.ts</code></td>
<td>Import line and spread entry removed</td>
</tr>
</tbody>
</table>
<p>No <code>.tsx</code> file is modified.</p>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash"># Top-level
python tools/remove_directory.py blog
python tools/remove_directory.py blog --dry-run

# Subdirectory one level deep
python tools/remove_directory.py tools --path docs
python tools/remove_directory.py tools --path docs --dry-run

# Any depth — pass the full parent path
python tools/remove_directory.py sub --path docs/tools
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>This is a destructive operation — all <code>.ts</code> files inside the deleted directory are removed.</li>
<li>Use <code>--dry-run</code> first to preview exactly what will be removed.</li>
<li>Missing files are skipped with a <code>[skip]</code> notice rather than causing an error.</li>
<li>After removing, run <code>npm run lint</code> to verify.</li>
</ul>`,
    },
  ],
};

export const readme = `# remove-directory

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
