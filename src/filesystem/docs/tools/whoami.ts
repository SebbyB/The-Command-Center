import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'whoami',
  description: 'Update the content displayed by the whoami terminal command.',
  tech: ['Python', 'TypeScript'],
  sections: [
    {
      title: 'Overview',
      body: `<p><code>whoami.py</code> rewrites the <code>execute</code> body of <code>src/commands/whoami.ts</code> with new lines of text. Each line becomes a separate <code>addLine()</code> call in the terminal. Optionally updates the command description shown in <code>help</code>.</p>
<p>Lines can be passed directly as positional arguments or read from a plain-text file.</p>`,
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/whoami.py [options] &quot;Line 1&quot; &quot;Line 2&quot; ...
python tools/whoami.py --file whoami.txt [options]
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
<td><code>LINE ...</code></td>
<td>yes (or <code>--file</code>)</td>
<td>One or more strings to display. Each becomes a separate <code>addLine()</code> call.</td>
</tr>
<tr>
<td><code>--file PATH</code></td>
<td>yes (or lines)</td>
<td>Read lines from a plain-text file (one line per row). Blank lines are preserved as empty <code>addLine('')</code> calls.</td>
</tr>
<tr>
<td><code>--description TEXT</code></td>
<td>no</td>
<td>Update the command description shown in <code>help</code></td>
</tr>
<tr>
<td><code>--dry-run</code></td>
<td>no</td>
<td>Print the resulting file without writing it</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash"># Pass lines directly
python tools/whoami.py &quot;Seb — Full-Stack Developer&quot; &quot;seb@example.com&quot;

# Read from a file
python tools/whoami.py --file whoami.txt

# Preview without writing
python tools/whoami.py --file whoami.txt --dry-run

# Update both content and description
python tools/whoami.py --description &quot;Show who I am&quot; &quot;Hi, I'm Seb.&quot; &quot;Based in London.&quot;
</code></pre>`,
    },
    {
      title: 'whoami.txt Format',
      body: `<p>Plain text, one line per <code>addLine()</code> call. Blank lines produce empty output lines in the terminal.</p>
<pre><code>Seb — Full-Stack Developer
seb@example.com

React · TypeScript · Python
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>You must provide either positional line arguments or <code>--file</code>, not both.</li>
<li>The tool uses a regex to locate the <code>execute</code> block and will error if <code>whoami.ts</code> has been edited into an unexpected shape.</li>
<li>After writing, run <code>npm run lint</code> to verify the generated TypeScript.</li>
</ul>`,
    },
  ],
};

export const readme = `# whoami

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
