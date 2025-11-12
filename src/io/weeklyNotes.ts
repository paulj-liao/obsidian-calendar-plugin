import type { Moment } from "moment";
import { Notice, type TFile } from "obsidian";
import {
  createWeeklyNote,
  getWeeklyNoteSettings,
} from "obsidian-daily-notes-interface";

import type { ISettings } from "src/settings";
import { createConfirmationDialog } from "src/ui/modal";

/**
 * Create a Weekly Note for a given date.
 */
export async function tryToCreateWeeklyNote(
  date: Moment,
  inNewSplit: boolean,
  settings: ISettings,
  cb?: (file: TFile) => void
): Promise<void> {
  const { workspace } = window.app;
  const { format } = getWeeklyNoteSettings();
  const filename = date.format(format);

  const createFile = async () => {
    try {
      const weeklyNote = await createWeeklyNote(date);
      const leaf = inNewSplit
        ? workspace.splitActiveLeaf()
        : workspace.getUnpinnedLeaf();

      await leaf.openFile(weeklyNote, { active : true });
      cb?.(weeklyNote);
    } catch (error) {
      new Notice(
        `Calendar: Failed to create weekly note "${filename}". ${error.message || "Unknown error"}`,
        7000
      );
      console.error("[Calendar] Error creating weekly note:", error);
    }
  };

  if (settings.shouldConfirmBeforeCreate) {
    createConfirmationDialog({
      cta: "Create",
      onAccept: createFile,
      text: `File ${filename} does not exist. Would you like to create it?`,
      title: "New Weekly Note",
    });
  } else {
    await createFile();
  }
}
