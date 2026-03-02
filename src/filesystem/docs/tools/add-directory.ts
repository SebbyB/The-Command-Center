import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'add-directory',
  description: 'Add a section directory (top-level or nested) to the virtual filesystem.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>add_directory.py</code> creates a new directory in the virtual filesystem. Without <code>--path</code> it scaffolds a complete top-level section (React component + data files). With <code>--path</code> it creates a subdirectory inside an existing section — no React component is needed because subdirectories inherit the parent section\'s component.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code># Top-level section
python tools/add_directory.py &lt;name&gt; [--description TEXT] [--dry-run]

# Subdirectory inside an existing section
python tools/add_directory.py &lt;name&gt; --path &lt;parent&gt; [--dry-run]
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
<td>Slug for the new directory. Lowercase letters, digits, hyphens.</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>no</td>
<td>Parent path for a subdirectory (e.g. <code>docs</code>, <code>docs/tools</code>). Omit for a top-level section.</td>
</tr>
<tr>
<td><code>--description</code></td>
<td>no</td>
<td>Short description shown on the home screen (top-level only)</td>
</tr>
<tr>
<td><code>--dry-run</code></td>
<td>no</td>
<td>Print generated output without writing any files</td>
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
      title: 'What Gets Created (top-level, no --path)',
      body: `<table>
<thead>
<tr>
<th>File</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>src/filesystem/&lt;name&gt;/data.ts</code></td>
<td>Empty <code>PageMeta[]</code> list</td>
</tr>
<tr>
<td><code>src/filesystem/&lt;name&gt;/index.ts</code></td>
<td>Exports the list and directory map</td>
</tr>
<tr>
<td><code>src/sections/&lt;Name&gt;.tsx</code></td>
<td>Section list React component</td>
</tr>
</tbody>
</table>
<p>Updated: <code>src/filesystem/index.ts</code> (entry added), <code>src/filesystem/pageRegistry.ts</code> (list registered).</p>`,
    },
    {
      title: 'What Gets Created (subdirectory, with --path)',
      body: `<table>
<thead>
<tr>
<th>File</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>src/filesystem/&lt;parent&gt;/&lt;name&gt;/data.ts</code></td>
<td>Empty <code>PageMeta[]</code> list</td>
</tr>
<tr>
<td><code>src/filesystem/&lt;parent&gt;/&lt;name&gt;/index.ts</code></td>
<td>Exports the list and directory map</td>
</tr>
</tbody>
</table>
<p>Updated: <code>src/filesystem/&lt;parent&gt;/index.ts</code> (entry added), <code>src/filesystem/pageRegistry.ts</code> (list registered).</p>
<p>No <code>.tsx</code> component is created — subdirectories use the generic <code>SubdirList</code> component, which reads children dynamically from the navigation context and works at any depth.</p>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash"># Top-level
python tools/add_directory.py blog --description &quot;My blog posts&quot;
python tools/add_directory.py skills --dry-run

# Subdirectory one level deep
python tools/add_directory.py tools --path docs
python tools/add_directory.py tools --path docs --dry-run

# Subdirectory two levels deep
python tools/add_directory.py sub --path docs/tools

# Any depth — pass the full parent path
python tools/add_directory.py deep --path docs/tools/sub
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>The <code>name</code> must match <code>^[a-z][a-z0-9\\-_]*$</code>.</li>
<li>Top-level: errors out if <code>src/filesystem/&lt;name&gt;/</code> or <code>src/sections/&lt;Name&gt;.tsx</code> already exist.</li>
<li>Subdirectory: the parent must already have an <code>index.ts</code> (i.e. be set up with this tool).</li>
<li>After creating, use <code>md_to_page.py</code> or <code>add_page.py</code> with the matching <code>--path</code> to populate it.</li>
<li>After writing, run <code>npm run lint</code> to verify the generated TypeScript.</li>
</ul>`,
    },
  ],
};

export const readme = `# add-directory

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
