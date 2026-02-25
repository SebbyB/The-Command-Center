import type { ComponentType } from 'react';

export interface VirtualFile {
  type: 'file';
  content: string;
}

export interface VirtualDirectory {
  type: 'directory';
  component?: ComponentType;
  description?: string;
  children: Record<string, VirtualNode>;
}

export type VirtualNode = VirtualFile | VirtualDirectory;
