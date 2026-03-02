import type { PageMeta } from '../page-types';
import { meta as emptyMeta } from './empty';
import { meta as termButtonMeta } from './term-button';
import { meta as vanillaButtonMeta } from './vanilla-button';
import { meta as imageMeta } from './image';
import { meta as realtimeMeta } from './realtime';

const examplePagesList: PageMeta[] = [
  emptyMeta,
  termButtonMeta,
  vanillaButtonMeta,
  imageMeta,
  realtimeMeta,
];

export default examplePagesList;
