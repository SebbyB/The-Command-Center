import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'remove-command',
  description: 'Remove a custom terminal command from the portfolio site.',
  tech: ['Python'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>remove_command.py</code> reverses what <code>add_command.py</code> did. It removes the command\'s registration from <code>src/commands/index.ts</code> and deletes the command\'s <code>.ts</code> (or <code>.js</code>) source file.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/remove_command.py &lt;name&gt; [--dry-run]
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
<td>Command name to remove (e.g. <code>ping</code>)</td>
</tr>
<tr>
<td><code>--dry-run</code></td>
<td>no</td>
<td>Print what would be removed without modifying any files</td>
</tr>
</tbody>
</table>`,
    },
    {
      title: 'What Gets Removed',
      body: `<ul>
<li><code>src/commands/&lt;name&gt;.ts</code> (or <code>.js</code>) — deleted</li>
<li><code>src/commands/index.ts</code> — import line and registration entry removed</li>
</ul>`,
    },
    {
      title: 'Protected Commands',
      body: `<p>The following built-in commands cannot be removed:</p>
<p><code>help</code>, <code>whoami</code>, <code>ls</code>, <code>cd</code>, <code>cat</code>, <code>echo</code>, <code>clear</code>, <code>animations</code></p>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/remove_command.py ping
python tools/remove_command.py ping --dry-run
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>The tool accepts either a <code>.ts</code> or <code>.js</code> file in <code>src/commands/</code> — it checks for both extensions automatically.</li>
<li>Attempting to remove a protected built-in command exits with an error.</li>
<li>Attempting to remove a command not found in <code>index.ts</code> logs a <code>[not found]</code> notice and skips without error.</li>
<li>After removing, run <code>npm run lint</code> to verify.</li>
</ul>`,
    },
  ],
};

export const readme = `# remove-command

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
