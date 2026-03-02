import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'remove-file',
  description: 'Remove a file entry previously added by add_file.py.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: `<p><code>remove_file.py</code> is the inverse of <code>add_file.py</code>. It removes a <code>type: 'file'</code> entry from a section (or from the root filesystem) and deletes the backing TypeScript source file.</p>
<p>Root-level files (entries directly in <code>filesystem/index.ts</code>, not inside a section) are removed by passing <code>--path /</code>.</p>`,
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/remove_file.py &lt;slug&gt; --path &lt;target-path&gt; [--dry-run]
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
<td>yes</td>
<td>File slug or filename (e.g. <code>my-notes</code> or <code>about.txt</code>)</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>yes</td>
<td>Directory the file lives under, or <code>/</code> for root-level files. Supports nested paths (e.g. <code>docs/tools</code>).</td>
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
      title: 'What Gets Removed',
      body: `<p><strong>Section or subdirectory files</strong> (<code>--path &lt;section&gt;</code> or <code>--path &lt;section/subdir&gt;</code>):
- <code>src/filesystem/&lt;path&gt;/&lt;slug&gt;.ts</code> — deleted
- <code>src/filesystem/&lt;path&gt;/index.ts</code> — import and file entry removed</p>
<p><strong>Root-level files</strong> (<code>--path /</code>):
- The source <code>.ts</code> file referenced by the import — deleted
- <code>src/filesystem/index.ts</code> — import line and children entry removed</p>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/remove_file.py about.txt --path /
python tools/remove_file.py skills.json --path /
python tools/remove_file.py my-notes --path experience
python tools/remove_file.py my-notes --path experience --dry-run

# Nested subdirectory
python tools/remove_file.py notes --path docs/tools
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>Use <code>--path /</code> for files that live at the virtual filesystem root (i.e. readable with <code>cat about.txt</code> from <code>~</code>).</li>
<li>Use <code>--path &lt;section&gt;</code> for files nested inside a section directory.</li>
<li>Entries not found are reported and the script exits with an error rather than silently succeeding.</li>
<li>After removing, run <code>npm run lint</code> to verify.</li>
</ul>`,
    },
  ],
};

export const readme = `# remove-file

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
