import { Notice } from 'obsidian';

export function showSuccess(message: string): void {
  new Notice(`✅ ${message}`, 4000);
}

export function showError(message: string): void {
  new Notice(`❌ ${message}`, 6000);
}

export function showInfo(message: string): void {
  new Notice(`ℹ️ ${message}`, 3000);
}
