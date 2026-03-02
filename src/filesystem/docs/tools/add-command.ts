import type { PageMeta } from '../../page-types';

export const meta: PageMeta = {
  name: 'add-command',
  description: 'Install a custom terminal command into the portfolio site.',
  tech: ['Python', 'TypeScript'],
  sections: [
    {
      title: 'Overview',
      body: '<p><code>add_command.py</code> takes a <code>.ts</code> or <code>.js</code> file that exports a <code>Command</code> object and wires it into <code>src/commands/index.ts</code>, making the command available in the terminal immediately after the next build.</p>',
    },
    {
      title: 'Usage',
      body: `<pre><code>python tools/add_command.py &lt;command-file&gt; [--dry-run]
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
<td><code>command-file</code></td>
<td>yes</td>
<td>Path to a <code>.ts</code> or <code>.js</code> file exporting a default <code>Command</code> object</td>
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
      title: 'Command File Format',
      body: `<p>The file must export a default object matching the <code>Command</code> interface. The filename stem becomes the command name (e.g. <code>ping.ts</code> → <code>ping</code>).</p>
<pre><code class="language-typescript">import type { Command } from './types';

const ping: Command = {
  description: 'Ping the home server',
  execute: async ({ args, addLine }) =&gt; {
    addLine('Pinging...');
    try {
      const res = await fetch('https://example.com/ping');
      addLine(res.ok ? 'Server is up.' : 'Server returned ' + res.status, res.ok ? 'output' : 'error');
    } catch {
      addLine('Could not reach server.', 'error');
    }
  },
};

export default ping;
</code></pre>
<p>The file is <strong>copied as-is</strong> into <code>src/commands/</code>. Any imports must already be relative to that directory (e.g. <code>import type { Command } from './types';</code>).</p>`,
    },
    {
      title: 'Command Naming',
      body: '<p>The stem of the filename is used as the command name and must match <code>^[a-z][a-z0-9_]*$</code> — lowercase letters, digits, and underscores only (e.g. <code>ping</code>, <code>check_status</code>, <code>roll</code>).</p>',
    },
    {
      title: 'Protected Commands',
      body: `<p>The following built-in commands cannot be overwritten:</p>
<p><code>help</code>, <code>whoami</code>, <code>ls</code>, <code>cd</code>, <code>cat</code>, <code>echo</code>, <code>clear</code>, <code>animations</code></p>`,
    },
    {
      title: 'What Gets Written',
      body: `<ul>
<li><code>src/commands/&lt;name&gt;.ts</code> — copied from source</li>
<li><code>src/commands/index.ts</code> — updated with import and registration</li>
</ul>`,
    },
    {
      title: 'Examples',
      body: `<pre><code class="language-bash">python tools/add_command.py tools/example-content/commands/ping.ts
python tools/add_command.py my-command.ts --dry-run
</code></pre>`,
    },
    {
      title: 'Notes',
      body: `<ul>
<li>If <code>&lt;name&gt;.ts</code> already exists in <code>src/commands/</code> it will be overwritten with a warning.</li>
<li>After writing, run <code>npm run lint</code> to verify the generated TypeScript.</li>
<li>To remove a command later, use <code>remove_command.py</code>.</li>
</ul>`,
    },
  ],
};

export const readme = `# add-command

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
`;
