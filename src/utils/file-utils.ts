import { App, Notice, TFile } from 'obsidian';

export interface NoteFrontmatter {
  title?: string;
  subtitle?: string;
  'cover-scheme'?: string;
  theme?: string;
  'wechat-app-id'?: string;
}

export function getActiveNoteFile(app: App): TFile | null {
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    new Notice('No active note. Please open a note first.');
    return null;
  }
  return activeFile;
}

export function getActiveNoteContent(app: App): string {
  const editor = app.workspace.activeEditor?.editor;
  if (!editor) {
    new Notice('No active editor. Please open a note.');
    return '';
  }
  return editor.getValue();
}

export function getNoteFrontmatter(app: App): NoteFrontmatter {
  const file = getActiveNoteFile(app);
  if (!file) return {};

  const cache = app.metadataCache.getFileCache(file);
  const frontmatter = cache?.frontmatter;
  if (!frontmatter) return {};

  return {
    title: frontmatter['title'] ?? undefined,
    subtitle: frontmatter['subtitle'] ?? undefined,
    'cover-scheme': frontmatter['cover-scheme'] ?? undefined,
    theme: frontmatter['theme'] ?? undefined,
    'wechat-app-id': frontmatter['wechat-app-id'] ?? undefined,
  };
}

export function getNoteTitle(app: App): string {
  const fm = getNoteFrontmatter(app);
  if (fm.title) return fm.title;

  const file = getActiveNoteFile(app);
  if (file) {
    // Use filename without extension
    return file.basename;
  }
  return 'Untitled';
}

export function getNoteSubtitle(app: App): string {
  const fm = getNoteFrontmatter(app);
  return fm.subtitle ?? '';
}

export function getCoverAttachmentPath(app: App, noteTitle: string): string {
  const file = getActiveNoteFile(app);
  if (!file) return '';

  // Save cover next to the note: note-name-cover.png
  const dir = file.parent?.path ?? '';
  const safeName = noteTitle.replace(/[\\/:*?"<>|#]/g, '-');
  return `${dir}/${safeName}-cover.png`;
}

export async function writeCoverPng(app: App, blob: Blob, filePath: string): Promise<void> {
  const arrayBuffer = await blob.arrayBuffer();
  const vault = app.vault;

  const existing = vault.getAbstractFileByPath(filePath);
  if (existing) {
    await vault.modifyBinary(existing as TFile, arrayBuffer);
  } else {
    await vault.createBinary(filePath, arrayBuffer);
  }
}
