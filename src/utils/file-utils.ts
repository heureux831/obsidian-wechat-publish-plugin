import { App, Notice, TFile } from 'obsidian';

export interface NoteFrontmatter {
  title?: string;
  subtitle?: string;
  'cover-scheme'?: string;
  theme?: string;
  'wechat-app-id'?: string;
}

/**
 * Get the best available file: active file first, fallback to provided file.
 * Does NOT show a Notice — callers decide whether to warn the user.
 */
export function getBestFile(app: App, fallback?: TFile | null): TFile | null {
  const activeFile = app.workspace.getActiveFile();
  if (activeFile) return activeFile;
  return fallback ?? null;
}

export function getActiveNoteFile(app: App, fallback?: TFile | null): TFile | null {
  const file = getBestFile(app, fallback);
  if (!file) {
    new Notice('No note is open. Please open a note first.');
    return null;
  }
  return file;
}

export async function getActiveNoteContent(app: App, fallback?: TFile | null): Promise<string> {
  const editor = app.workspace.activeEditor?.editor;
  if (editor) return editor.getValue();

  // Fallback: read from the last known file on disk
  const file = getBestFile(app, fallback);
  if (file) {
    const content = await app.vault.read(file);
    return content;
  }

  new Notice('No active editor. Please open a note.');
  return '';
}

export function getNoteFrontmatter(app: App, fallback?: TFile | null): NoteFrontmatter {
  const file = getBestFile(app, fallback);
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

export function getNoteTitle(app: App, fallback?: TFile | null): string {
  const fm = getNoteFrontmatter(app, fallback);
  if (fm.title) return fm.title;

  const file = getBestFile(app, fallback);
  if (file) {
    return file.basename;
  }
  return 'Untitled';
}

export function getNoteSubtitle(app: App, fallback?: TFile | null): string {
  const fm = getNoteFrontmatter(app, fallback);
  return fm.subtitle ?? '';
}

export function getCoverAttachmentPath(app: App, noteTitle: string, fallback?: TFile | null): string {
  const file = getBestFile(app, fallback);
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
