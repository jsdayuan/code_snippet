export function formatCode(code: string, language: string): string {
  const trimmedCode = code.trim();
  if (!trimmedCode) return code;

  try {
    switch (language.toLowerCase()) {
      case 'json':
        return formatJson(trimmedCode);
      case 'javascript':
      case 'typescript':
        return formatJs(trimmedCode);
      case 'yaml':
      case 'yml':
        return formatYaml(trimmedCode);
      case 'html':
      case 'xml':
        return formatHtml(trimmedCode);
      case 'css':
        return formatCss(trimmedCode);
      case 'sql':
        return formatSql(trimmedCode);
      case 'markdown':
      case 'md':
        return formatMarkdown(trimmedCode);
      default:
        return code;
    }
  } catch {
    return code;
  }
}

function formatJson(code: string): string {
  const parsed = JSON.parse(code);
  return JSON.stringify(parsed, null, 2) + '\n';
}

function formatJs(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let indent = 0;
  const indentSize = 2;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }

    if (trimmed.endsWith('{') || trimmed.endsWith('[')) {
      result.push(' '.repeat(indent * indentSize) + trimmed);
      indent++;
    } else if (trimmed === '}' || trimmed === ']') {
      indent = Math.max(0, indent - 1);
      result.push(' '.repeat(indent * indentSize) + trimmed);
    } else if (trimmed.endsWith('}') || trimmed.endsWith(']')) {
      indent = Math.max(0, indent - 1);
      result.push(' '.repeat(indent * indentSize) + trimmed);
    } else if (trimmed.endsWith(';') && !trimmed.startsWith('}') && !trimmed.startsWith(']')) {
      result.push(' '.repeat(indent * indentSize) + trimmed);
    } else if (trimmed.startsWith('}') || trimmed.startsWith(']')) {
      indent = Math.max(0, indent - 1);
      result.push(' '.repeat(indent * indentSize) + trimmed);
    } else {
      result.push(' '.repeat(indent * indentSize) + trimmed);
    }
  }

  return result.join('\n') + '\n';
}

function formatYaml(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let indent = 0;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }

    if (trimmed.endsWith(':')) {
      const match = line.match(/^(\s*)/);
      const currentIndent = match ? match[1].length : 0;
      indent = currentIndent + 2;
      result.push(line);
    } else if (trimmed.startsWith('- ')) {
      const match = line.match(/^(\s*)-/);
      const currentIndent = match ? match[1].length : 0;
      indent = currentIndent + 2;
      result.push(line);
    } else {
      const hasValue = trimmed.includes(':');
      if (hasValue) {
        const match = line.match(/^(\s*)/);
        const currentIndent = match ? match[1].length : 0;
        indent = currentIndent;
        result.push(line);
      } else {
        result.push(' '.repeat(indent) + trimmed);
      }
    }
  }

  return result.join('\n') + '\n';
}

function formatHtml(code: string): string {
  const trimmed = code.trim();
  const minified = trimmed.replace(/>\s+</g, '><');
  const lines: string[] = [];
  let indent = 0;
  const indentSize = 2;
  let currentLine = '';

  for (let i = 0; i < minified.length; i++) {
    const char = minified[i];
    // const nextChar = minified[i + 1];

    if (char === '<') {
      if (currentLine.trim()) {
        lines.push(' '.repeat(indent * indentSize) + currentLine.trim());
        currentLine = '';
      }

      let tag = '<';
      i++;
      while (i < minified.length && minified[i] !== '>') {
        tag += minified[i];
        i++;
      }
      tag += '>';

      const tagName = tag.match(/<(\/?)(\w+)/);
      if (tagName) {
        const isClosing = tagName[1] === '/';
        const isSelfClosing = tag.includes('/>');

        if (isClosing) {
          indent = Math.max(0, indent - 1);
        }

        if (isSelfClosing || isClosing) {
          lines.push(' '.repeat(indent * indentSize) + tag);
        } else {
          lines.push(' '.repeat(indent * indentSize) + tag);
          indent++;
        }
      } else {
        lines.push(' '.repeat(indent * indentSize) + tag);
      }
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(' '.repeat(indent * indentSize) + currentLine.trim());
  }

  return lines.join('\n') + '\n';
}

function formatCss(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let indent = 0;
  const indentSize = 2;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }

    if (trimmed.endsWith('{')) {
      result.push(' '.repeat(indent * indentSize) + trimmed);
      indent++;
    } else if (trimmed === '}' || trimmed.endsWith('}')) {
      indent = Math.max(0, indent - 1);
      result.push(' '.repeat(indent * indentSize) + trimmed);
    } else {
      result.push(' '.repeat(indent * indentSize) + trimmed);
    }
  }

  return result.join('\n') + '\n';
}

function formatSql(code: string): string {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'IN', 'NOT', 'LIKE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'INDEX', 'UNIQUE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NULL', 'NOT NULL', 'DEFAULT', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'UNION', 'ALL', 'EXISTS'];

  const lines = code.split('\n');
  const result: string[] = [];

  for (let line of lines) {
    let formattedLine = line;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      formattedLine = formattedLine.replace(regex, (match) => match.toUpperCase());
    }
    result.push(formattedLine);
  }

  const combined = result.join('\n').replace(/\s+WHERE\b/g, '\nWHERE').replace(/\s+FROM\b/g, '\nFROM').replace(/\s+AND\b/g, '\n  AND').replace(/\s+OR\b/g, '\n  OR').replace(/\s+JOIN\b/g, '\nJOIN').replace(/\s+ON\b/g, '\n  ON').replace(/\s+GROUP BY\b/g, '\nGROUP BY').replace(/\s+HAVING\b/g, '\nHAVING').replace(/\s+ORDER BY\b/g, '\nORDER BY').replace(/\s+LIMIT\b/g, '\nLIMIT');

  return combined + '\n';
}

function formatMarkdown(code: string): string {
  const lines = code.split('\n');
  const result: string[] = [];
  let inCodeBlock = false;

  for (let line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    if (trimmed.startsWith('#')) {
      result.push(line);
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
      result.push(line);
      continue;
    }

    if (/^\d+\./.test(trimmed)) {
      result.push(line);
      continue;
    }

    result.push(line);
  }

  return result.join('\n') + '\n';
}
