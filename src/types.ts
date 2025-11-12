import type { App, EventRef, FileManager, Plugin, TFile, Vault, Workspace } from "obsidian";

/**
 * Extended Obsidian types for accessing internal APIs
 * These types represent undocumented but stable Obsidian APIs
 *
 * Note: These use declaration merging patterns rather than extension
 * to avoid conflicts with Obsidian's internal type definitions
 */

export type ObsidianInternalWorkspace = Workspace & {
  on(
    name: "periodic-notes:settings-updated",
    callback: () => void,
    ctx?: unknown
  ): EventRef;
};

export type ObsidianInternalFileManager = FileManager & {
  promptForFileDeletion(file: TFile): Promise<void>;
};

export type ObsidianInternalApp = App & {
  plugins: {
    getPlugin(id: string): Plugin | null;
  };
  fileManager: ObsidianInternalFileManager;
};

export type ObsidianInternalVault = Vault & {
  getConfig(key: string): unknown;
};

/**
 * Svelte component internal type for accessing contentEl
 */
export interface ItemViewWithContentEl {
  contentEl: HTMLElement;
}
