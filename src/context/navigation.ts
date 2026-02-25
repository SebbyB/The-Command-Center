import { createContext, useContext } from 'react';
import type { VirtualDirectory } from '../filesystem/types';

interface NavigationContextValue {
  currentPath: string[];
  currentDir: VirtualDirectory;
  onNavigate: (path: string[]) => void;
}

const NavigationContext = createContext<NavigationContextValue>({
  currentPath: [],
  currentDir: { type: 'directory', children: {} },
  onNavigate: () => {},
});

export const useNavigation = () => useContext(NavigationContext);
export default NavigationContext;
