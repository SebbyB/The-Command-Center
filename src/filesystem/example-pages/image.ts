import type { PageMeta } from '../page-types';

export const meta: PageMeta = {
  name: 'image',
  description: 'A demonstration of image sections using the most important subject matter available.',
  tech: ['cats', 'jpeg', 'vibes'],
  sections: [
    {
      title: 'exhibit a',
      body: 'This is a cat. It is doing cat things. No further explanation is required or will be provided.',
      image: 'https://cataas.com/cat?width=800&height=400&1',
    },
    {
      title: 'exhibit b',
      body: 'A second cat, included for scientific comparison. Note the subtle differences. Researchers are baffled.',
      image: 'https://cataas.com/cat?width=800&height=400&2',
    },
    {
      title: 'exhibit c',
      body: 'The third and final cat. This one is widely regarded as the best cat, though the methodology behind this ranking remains disputed.',
      image: 'https://cataas.com/cat?width=800&height=400&3',
    },
  ],
};

export const readme = `# image

${meta.description}
`;
