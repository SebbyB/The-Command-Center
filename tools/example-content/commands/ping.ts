import type { Command } from './types';

const ping: Command = {
  description: 'Ping the home server',
  execute: async ({ args, addLine }) => {
    const target = args[0] ?? 'https://example.com';
    addLine(`Pinging ${target}...`);
    try {
      const start = Date.now();
      await fetch(target, { method: 'HEAD', mode: 'no-cors' });
      const ms    = Date.now() - start;
      addLine(`Reply from ${target}: time=${ms}ms`);
    } catch {
      addLine(`Request failed: could not reach ${target}`, 'error');
    }
  },
};

export default ping;
