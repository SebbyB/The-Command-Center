import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'md-to-page',
  description: 'Convert a Markdown file into a portfolio site page entry.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>md_to_page.py</code> turns a local <code>.md</code> file into a fully wired TypeScript page entry inside any virtual-filesystem section. It parses frontmatter for metadata, converts <code>##</code> body sections to HTML, writes <code>&lt;slug&gt;.ts</code>, and updates the section\'s <code>data.ts</code> and <code>index.ts</code> automatically.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/md_to_page.py &lt;input.md&gt; --path &lt;target-path&gt; [--dry-run]
</code></pre>
<p>Run from the project root. The section specified by <code>--path</code> must already exist (created with <code>add_directory.py</code>).</p>`,
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
<td>Path to the source Markdown file</td>
</tr>
<tr>
<td><code>--path</code></td>
<td>yes</td>
<td>Directory to add the entry under. Use <code>/</code> or <code>~</code> for the root (<code>~/</code>). Supports nested paths (e.g. <code>projects</code>, <code>docs/tools</code>).</td>
</tr>
<tr>
<td><code>--dry-run</code></td>
<td>no</td>
<td>Print generated output without writing any files</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'Markdown Format',
      body: `<p>The file must open with a YAML frontmatter block delimited by <code>---</code>, followed by optional <code>##</code> sections whose content becomes the page body.</p>
<pre><code class="language-markdown">---
name: my-project
description: A short one-line description.
tech: React, TypeScript, Vite
repo: https://github.com/you/my-project
live: https://my-project.example.com
---

## Overview

What the project does.

## Features

- Feature one
- Feature two
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
<td>Slug — lowercase kebab-case, no spaces (<code>a-z</code>, <code>0-9</code>, <code>-</code>, <code>_</code>)</td>
</tr>
<tr>
<td><code>description</code></td>
<td>yes</td>
<td>Short one-line description</td>
</tr>
<tr>
<td><code>tech</code></td>
<td>no</td>
<td>Comma-separated technology list</td>
</tr>
<tr>
<td><code>repo</code></td>
<td>no</td>
<td>URL to source repository</td>
</tr>
<tr>
<td><code>live</code></td>
<td>no</td>
<td>URL to live deployment</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'What Gets Written',
      body: `<p><strong>Section or subdirectory</strong> (<code>--path &lt;section&gt;</code> or <code>--path &lt;section/subdir&gt;</code>):
- <code>src/filesystem/&lt;path&gt;/&lt;slug&gt;.ts</code> — TypeScript page entry with <code>meta</code> and <code>readme</code> exports
- <code>src/filesystem/&lt;path&gt;/data.ts</code> — updated to import and include the new entry
- <code>src/filesystem/&lt;path&gt;/index.ts</code> — updated with the directory entry and README</p>
<p><strong>Root</strong> (<code>--path /</code>):
- <code>src/filesystem/&lt;slug&gt;.ts</code> — TypeScript page entry
- <code>src/filesystem/index.ts</code> — updated with the directory entry
- <code>src/filesystem/pageRegistry.ts</code> — updated with the meta import</p>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/md_to_page.py my-project.md --path projects
python tools/md_to_page.py acme-job.md --path experience --dry-run

# Root home directory
python tools/md_to_page.py README.md --path /

# Nested subdirectory (docs/tools must exist — create with add_directory.py first)
python tools/md_to_page.py tree.md --path docs/tools
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>If <code>&lt;slug&gt;.ts</code> already exists it will be overwritten with a warning.</li>
<li>Requires <code>markdown</code> or <code>mistune</code> for full HTML conversion; falls back to a basic inline renderer if neither is installed.</li>
<li>After writing, run <code>npm run lint</code> to verify the generated TypeScript.</li>
</ul>`,
    },
  ],
};

export const readme = `# md-to-page

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
