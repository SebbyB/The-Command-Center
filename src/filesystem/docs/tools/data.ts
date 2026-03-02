import type { PageMeta } from '../../page-types';
import { meta as addCommandMeta } from './add-command';
import { meta as addDirectoryMeta } from './add-directory';
import { meta as addFileMeta } from './add-file';
import { meta as addPageMeta } from './add-page';
import { meta as removePageMeta } from './remove-page';
import { meta as removeCommandMeta } from './remove-command';
import { meta as removeDirectoryMeta } from './remove-directory';
import { meta as removeFileMeta } from './remove-file';
import { meta as treeMeta } from './tree';
import { meta as whoamiMeta } from './whoami';
import { meta as mdToPageMeta } from './md-to-page';

const docsToolsList: PageMeta[] = [
  addCommandMeta,
  addDirectoryMeta,
  addFileMeta,
  addPageMeta,
  removePageMeta,
  removeCommandMeta,
  removeDirectoryMeta,
  removeFileMeta,
  treeMeta,
  whoamiMeta,
  mdToPageMeta,
];

export default docsToolsList;
