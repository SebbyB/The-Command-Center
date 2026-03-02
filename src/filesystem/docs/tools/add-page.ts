import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'add-page',
  description: 'Add an empty page stub to a virtual filesystem section.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>add_page.py</code> creates a minimal TypeScript page entry inside an existing section and wires it into the section\'s <code>data.ts</code> and <code>index.ts</code>. The generated stub can be filled in later by editing the file directly or by running <code>md_to_page.py</code> against a Markdown source.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/add_page.py &lt;name&gt; --path &lt;section&gt; [options]
</code></pre>
<p>Run from the project root. The target section must already exist — create one first with <code>add_directory.py</code> if needed.</p>`,
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
<td>Slug for the new page. Lowercase kebab-case, no spaces.</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>yes</td>
<td>Directory to add the page under. Use <code>/</code> or <code>~</code> for root (<code>~/</code>). Supports nested paths (e.g. <code>projects</code>, <code>docs/tools</code>).</td>
</tr>
<tr>
<td><code>--description</code></td>
<td>no</td>
<td>Short one-line description (default: <code>TODO: add description</code>)</td>
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
      title: 'What Gets Written',
      body: `<p><strong>Section or subdirectory</strong> (<code>--path &lt;section&gt;</code> or <code>--path &lt;section/subdir&gt;</code>):
- <code>src/filesystem/&lt;path&gt;/&lt;name&gt;.ts</code> — stub with empty <code>meta</code> and <code>readme</code> exports
- <code>src/filesystem/&lt;path&gt;/data.ts</code> — updated to import and include the new entry
- <code>src/filesystem/&lt;path&gt;/index.ts</code> — updated with the directory entry and README</p>
<p><strong>Root</strong> (<code>--path /</code>):
- <code>src/filesystem/&lt;name&gt;.ts</code> — stub page entry
- <code>src/filesystem/index.ts</code> — updated with the directory entry
- <code>src/filesystem/pageRegistry.ts</code> — updated with the meta import</p>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/add_page.py my-project --path projects
python tools/add_page.py blog-post --path blog --description &quot;First post&quot;
python tools/add_page.py wip-page --path projects --dry-run
python tools/add_page.py new-entry --path experience --tree

# Root home directory
python tools/add_page.py readme --path /

# Nested subdirectory (docs/tools must exist — create with add_directory.py first)
python tools/add_page.py tree --path docs/tools
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>The <code>name</code> must match <code>^[a-z0-9][a-z0-9\\-_]*$</code> — lowercase letters, digits, hyphens, or underscores only.</li>
<li>If <code>&lt;name&gt;.ts</code> already exists it will be overwritten with a warning.</li>
<li>To populate the stub with real content, run <code>md_to_page.py</code> against a Markdown file using the same <code>--path</code>.</li>
<li>After writing, run <code>npm run lint</code> to verify the generated TypeScript.</li>
</ul>`,
    },
  ],
};

export const readme = `# add-page

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
