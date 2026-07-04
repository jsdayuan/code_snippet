import { useAppContext } from '../context/AppContext';

export function useSnippets() {
  const { state } = useAppContext();
  return {
    snippets: state.snippets,
    isLoading: state.isLoading,
  };
}