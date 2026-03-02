import type { PageMeta } from './page-types';

export const meta: PageMeta = {
  name: 'the-command-center',
  description: 'A React + TypeScript framework for building terminal-navigated sites',
  tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Python'],
  repo: 'https://github.com/SebbyB/The-Command-Center',
  live: 'https://trustingcarton.com',
  sections: [
    {
      title: 'About The Project',
      body: `<p>The Command Center is a framework built around a persistent terminal interface. The screen is split into two layers: a viewport (top) that renders content sections, and a terminal panel (bottom) that acts as the primary navigation mechanism. Users navigate the site by typing Unix-like commands — <code>cd</code>, <code>ls</code>, <code>cat</code> — against a virtual filesystem that maps to pages and sections.</p>
<p>The original concept for this project was inspired by JCubic's Jquery terminal emulator. When I was first learning embedded development on ESP32 boards, I would use a webserver hosted by the ESP32 and a websocket connection to utilize different sensors and collect data. I wanted a more visual way of doing this approach that included a combination of command line style navigation and site navigation.</p>
<h3>Key features:</h3>
<ul>
<li><strong>Terminal navigation</strong> — move between sections using <code>cd</code>, list contents with <code>ls</code>, read file content with <code>cat</code></li>
<li><strong>Virtual filesystem</strong> — content is organised as a tree of directories and pages defined in TypeScript</li>
<li><strong>Python content tools</strong> — scripts in <code>tools/</code> convert Markdown files into typed page definitions and wire them into the filesystem automatically</li>
<li><strong>Minimisable terminal panel</strong> — the terminal collapses to a title bar so the viewport content can be read full-screen</li>
<li><strong>Under construction mode</strong> — set <code>VITE_UNDER_CONSTRUCTION=true</code> to show a holding page without rebuilding content</li>
<li><strong>URL-addressable paths</strong> — the virtual filesystem path is reflected in the browser URL, so pages are directly linkable</li>
</ul>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<h3>Built With</h3>
<ul>
<li><a href="https://reactjs.org/"><img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&amp;logo=react&amp;logoColor=61DAFB"></a></li>
<li><a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&amp;logo=typescript&amp;logoColor=white"></a></li>
<li><a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&amp;logo=vite&amp;logoColor=white"></a></li>
<li><a href="https://tailwindcss.com/"><img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&amp;logo=tailwind-css&amp;logoColor=white"></a></li>
<li><a href="https://www.python.org/"><img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&amp;logo=python&amp;logoColor=white"></a></li>
</ul>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'Getting Started',
      body: `<h3>Prerequisites</h3>
<ul>
<li>Node.js (v18+) and npm</li>
<li>Python 3 (for the content tools)</li>
</ul>
<h3>Installation</h3>
<ol>
<li>Clone the repo
   <code>sh
   git clone https://github.com/SebbyB/The-Command-Center.git
   cd The-Command-Center</code></li>
<li>Install dependencies
   <code>sh
   npm install</code></li>
<li>Copy the example env file and configure as needed
   <code>sh
   cp .env.example .env</code></li>
<li>Start the dev server
   <code>sh
   npm run dev</code></li>
</ol>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'Usage',
      body: `<p>Navigate the site from the terminal panel at the bottom of the screen:</p>
<pre><code class="language-sh">ls                  # list the current directory's contents
cd section         # navigate into a section
cd ..               # go up one level
cat file           # display a file's content inline
clear               # clear terminal output
whoami              # display site info
animations          # toggle typewriter animation on/off
help                # list all available commands
</code></pre>
<p>To add a new page from a Markdown file, use the content tools:</p>
<pre><code class="language-sh">python tools/md_to_page.py content/projects/my-project.md
</code></pre>
<p>This converts the Markdown, registers the page in the filesystem, and wires it into the section index automatically.</p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'Roadmap',
      body: `<ul>
<li>[x] Terminal navigation with virtual filesystem</li>
<li>[x] Python content tooling (add/remove/toggle pages)</li>
<li>[x] Minimisable terminal panel</li>
<li>[x] URL-addressable paths</li>
<li>[x] Under construction mode</li>
<li>[ ] Hidden Directories</li>
<li>[ ] Tab completion</li>
<li>[ ] Embedded Systems Build Tools</li>
<li>[ ] Real time terminal Websocket Support</li>
</ul>
<p>See the <a href="https://github.com/SebbyB/The-Command-Center/issues">open issues</a> for a full list of proposed features (and known issues).</p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'Contributing',
      body: `<p>Contributions are welcome. If you have a suggestion, fork the repo and open a pull request, or open an issue with the tag "enhancement".</p>
<ol>
<li>Fork the Project</li>
<li>Create your Feature Branch (<code>git checkout -b feature/AmazingFeature</code>)</li>
<li>Commit your Changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
<li>Push to the Branch (<code>git push origin feature/AmazingFeature</code>)</li>
<li>Open a Pull Request</li>
</ol>
<h3>Top contributors:</h3>
<p><a href="https://github.com/SebbyB/The-Command-Center/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SebbyB/The-Command-Center" alt="contrib.rocks image" />
</a></p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'License',
      body: `<p>Distributed under the Unlicense License. See <code>LICENSE.txt</code> for more information.</p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'Contact',
      body: `<p>Sebastian Barney - <a href="https://www.linkedin.com/in/sebastianbarney1/">LinkedIn</a></p>
<p>Project Link: <a href="https://github.com/SebbyB/The-Command-Center">https://github.com/SebbyB/The-Command-Center</a></p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
    {
      title: 'Acknowledgments',
      body: `<ul>
<li><a href="https://github.com/othneildrew/Best-README-Template">Best-README-Template</a> — README structure</li>
<li><a href="https://shields.io">Img Shields</a> — badge generation</li>
<li><a href="https://www.jetbrains.com/lp/mono/">JetBrains Mono</a> — terminal font</li>
<li><a href="https://marked.js.org/">marked</a> — Markdown parsing</li>
<li><a href="https://github.com/jcubic/jquery.terminal">Jcubic Terminal Emulator</a> - Project inspiration.</li>
</ul>
<p align="right">(<a href="#readme-top">back to top</a>)</p>`,
    },
  ],
};

export const readme = `# the-command-center

${meta.description}

tech:  ${(meta.tech ?? []).join(' · ')}
repo:  ${meta.repo}
live:  ${meta.live}
`;
