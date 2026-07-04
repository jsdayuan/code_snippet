import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Snippet } from '../types/snippet';
import { createSnippet, updateSnippet, deleteSnippet, searchSnippets, filterSnippets } from '../services/storageService';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

interface AlertState {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  danger?: boolean;
}

interface AppState {
  snippets: Snippet[];
  searchQuery: string;
  selectedTags: string[];
  selectedLanguage: string;
  isSlideOverOpen: boolean;
  currentSnippet: Snippet | null;
  slideOverMode: 'create' | 'edit' | 'view';
  toast: ToastState;
  alert: AlertState;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_SNIPPETS'; payload: Snippet[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_TAG'; payload: string }
  | { type: 'CLEAR_TAGS' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'OPEN_SLIDEOVER'; payload: { mode: 'create' | 'edit' | 'view'; snippet?: Snippet } }
  | { type: 'CLOSE_SLIDEOVER' }
  | { type: 'SHOW_TOAST'; payload: { message: string; type?: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'OPEN_ALERT'; payload: Omit<AlertState, 'isOpen'> }
  | { type: 'CLOSE_ALERT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  snippets: [],
  searchQuery: '',
  selectedTags: [],
  selectedLanguage: '',
  isSlideOverOpen: false,
  currentSnippet: null,
  slideOverMode: 'create',
  toast: { message: '', type: 'info', visible: false },
  alert: { isOpen: false, title: '', onConfirm: undefined },
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SNIPPETS':
      return { ...state, snippets: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_TAG': {
      const tag = action.payload;
      const selectedTags = state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag];
      return { ...state, selectedTags };
    }
    case 'CLEAR_TAGS':
      return { ...state, selectedTags: [] };
    case 'SET_LANGUAGE':
      return { ...state, selectedLanguage: action.payload };
    case 'OPEN_SLIDEOVER':
      return {
        ...state,
        isSlideOverOpen: true,
        slideOverMode: action.payload.mode,
        currentSnippet: action.payload.snippet || null,
      };
    case 'CLOSE_SLIDEOVER':
      return {
        ...state,
        isSlideOverOpen: false,
        currentSnippet: null,
      };
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          message: action.payload.message,
          type: action.payload.type || 'info',
          visible: true,
        },
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: { ...state.toast, visible: false },
      };
    case 'OPEN_ALERT':
      return {
        ...state,
        alert: { ...action.payload, isOpen: true },
      };
    case 'CLOSE_ALERT':
      return {
        ...state,
        alert: { ...state.alert, isOpen: false },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  createSnippet: (data: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, data: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  fetchSnippets: () => void;
  searchSnippets: (keyword: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchSnippets = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const snippets = filterSnippets({
        language: state.selectedLanguage || undefined,
        tags: state.selectedTags.length > 0 ? state.selectedTags : undefined,
      });
      dispatch({ type: 'SET_SNIPPETS', payload: snippets });
    } catch {
      dispatch({ type: 'SHOW_TOAST', payload: { message: '加载失败', type: 'error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.selectedLanguage, state.selectedTags]);

  const handleSearch = useCallback((keyword: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let snippets: Snippet[];
      if (keyword.trim()) {
        snippets = searchSnippets(keyword);
      } else {
        snippets = filterSnippets({
          language: state.selectedLanguage || undefined,
          tags: state.selectedTags.length > 0 ? state.selectedTags : undefined,
        });
      }
      dispatch({ type: 'SET_SNIPPETS', payload: snippets });
    } catch {
      dispatch({ type: 'SHOW_TOAST', payload: { message: '搜索失败', type: 'error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.selectedLanguage, state.selectedTags]);

  const handleCreateSnippet = useCallback((data: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      createSnippet(data);
      fetchSnippets();
      dispatch({ type: 'SHOW_TOAST', payload: { message: '创建成功', type: 'success' } });
    } catch {
      dispatch({ type: 'SHOW_TOAST', payload: { message: '创建失败', type: 'error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchSnippets]);

  const handleUpdateSnippet = useCallback((id: string, data: Partial<Snippet>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = updateSnippet(id, data);
      if (result) {
        fetchSnippets();
        dispatch({ type: 'SHOW_TOAST', payload: { message: '更新成功', type: 'success' } });
      } else {
        dispatch({ type: 'SHOW_TOAST', payload: { message: '更新失败', type: 'error' } });
      }
    } catch {
      dispatch({ type: 'SHOW_TOAST', payload: { message: '更新失败', type: 'error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchSnippets]);

  const handleDeleteSnippet = useCallback((id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const success = deleteSnippet(id);
      if (success) {
        fetchSnippets();
        dispatch({ type: 'SHOW_TOAST', payload: { message: '删除成功', type: 'success' } });
      } else {
        dispatch({ type: 'SHOW_TOAST', payload: { message: '删除失败', type: 'error' } });
      }
    } catch {
      dispatch({ type: 'SHOW_TOAST', payload: { message: '删除失败', type: 'error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchSnippets]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        createSnippet: handleCreateSnippet,
        updateSnippet: handleUpdateSnippet,
        deleteSnippet: handleDeleteSnippet,
        fetchSnippets,
        searchSnippets: handleSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}