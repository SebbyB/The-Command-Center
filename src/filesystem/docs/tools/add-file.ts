import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'add-file',
  description: 'Add a plain-text file entry to a virtual filesystem section.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: `<p><code>add_file.py</code> creates a <code>type: 'file'</code> entry inside an existing section. Unlike a page created with <code>md_to_page.py</code>, a file entry does <strong>not</strong> appear in the section list and cannot be navigated with <code>cd</code> — it is only accessible by name with <code>cat</code> in the terminal.</p>
<p>This is useful for supplementary content like notes, changelogs, or config snippets that should live inside a section but not be listed as standalone pages.</p>`,
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/add_file.py &lt;input.md&gt; --path &lt;target-path&gt; [--dry-run]
</code></pre>
<p>Run from the project root. The target section must already exist.</p>`,
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
<td><code>input.md</code></td>
<td>yes</td>
<td>Path to the source file</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>yes</td>
<td>Directory to add the file under. Supports nested paths (e.g. <code>projects</code>, <code>docs/tools</code>).</td>
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
      title: 'Markdown Format',
      body: `<p>The file must open with a frontmatter block. Only <code>name</code> is required. Everything after the closing <code>---</code> becomes the raw file content.</p>
<pre><code class="language-markdown">---
name: my-notes
---

Content goes here. Accessible with \`cat my-notes\` in the terminal.
Multiple lines are fine.
</code></pre>
<p><strong>Frontmatter fields:</strong></p>
<table>
<thead>
<tr>
<th>Field</th>
<th>Required</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>name</code></td>
<td>yes</td>
<td>Slug — matches <code>^[a-z0-9][a-z0-9\\-_.]*$</code> (dots allowed for filenames like <code>readme.txt</code>)</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'What Gets Written',
      body: `<ul>
<li><code>src/filesystem/&lt;path&gt;/&lt;slug&gt;.ts</code> — exports the raw text content as a string constant</li>
<li><code>src/filesystem/&lt;path&gt;/index.ts</code> — updated with a <code>type: 'file'</code> entry</li>
</ul>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/add_file.py notes.md --path experience
python tools/add_file.py changelog.md --path projects --dry-run

# Nested subdirectory
python tools/add_file.py notes.md --path docs/tools
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>The <code>contact</code> section is blocked and does not accept sub-entries.</li>
<li>If <code>&lt;slug&gt;.ts</code> already exists it will be overwritten with a warning.</li>
<li>After writing, run <code>npm run lint</code> to verify the generated TypeScript.</li>
</ul>`,
    },
  ],
};

export const readme = `# add-file

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
