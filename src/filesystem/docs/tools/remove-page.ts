import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'remove-page',
  description: 'Remove a page entry previously added by md_to_page.py or add_page.py.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>remove_page.py</code> is the inverse of <code>md_to_page.py</code> and <code>add_page.py</code>. It removes the <code>&lt;slug&gt;.ts</code> file from the section and cleans up all references in the section\'s <code>data.ts</code> and <code>index.ts</code>.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/remove_page.py &lt;slug&gt; --path &lt;target-path&gt; [--dry-run]
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
<td>The page slug — the value of the <code>name</code> field from its frontmatter</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>yes</td>
<td>Directory the page was added under. Supports nested paths (e.g. <code>projects</code>, <code>docs/tools</code>).</td>
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
      body: `<ul>
<li><code>src/filesystem/&lt;path&gt;/&lt;slug&gt;.ts</code> — deleted</li>
<li><code>src/filesystem/&lt;path&gt;/data.ts</code> — import and array entry removed</li>
<li><code>src/filesystem/&lt;path&gt;/index.ts</code> — import and directory entry block removed</li>
</ul>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/remove_page.py my-project --path projects
python tools/remove_page.py acme-job --path experience --dry-run
python tools/remove_page.py old-entry --path blog --tree

# Nested subdirectory
python tools/remove_page.py tree --path docs/tools
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>Errors out if the section directory does not exist.</li>
<li>Errors out if <code>&lt;slug&gt;.ts</code> is not found in the section.</li>
<li>Entries not found in <code>data.ts</code> or <code>index.ts</code> are skipped with a warning rather than failing.</li>
<li>After removing, run <code>npm run lint</code> to verify.</li>
</ul>`,
    },
  ],
};

export const readme = `# remove-page

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
