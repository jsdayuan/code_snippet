export interface Snippet {
  id: string;
  title: string;
  language: string;
  tags: string[];
  description: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetDto {
  title: string;
  language: string;
  tags?: string[];
  description?: string;
  code: string;
}

export interface UpdateSnippetDto {
  title?: string;
  language?: string;
  tags?: string[];
  description?: string;
  code?: string;
}