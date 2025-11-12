import { Notice, type TFile } from "obsidian";
import {
  getAllDailyNotes,
  getAllWeeklyNotes,
} from "obsidian-daily-notes-interface";
import { writable } from "svelte/store";

import { defaultSettings, type ISettings } from "src/settings";

import { getDateUIDFromFile } from "./utils";

function createDailyNotesStore() {
  let hasError = false;
  const store = writable<Record<string, TFile> | null>(null);
  return {
    reindex: () => {
      try {
        const dailyNotes = getAllDailyNotes();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store.set(dailyNotes as any);
        hasError = false;
      } catch (err) {
        if (!hasError) {
          // Show user-facing error notification
          new Notice(
            "Calendar: Unable to load daily notes. Please check your Daily Notes plugin settings.",
            5000
          );
          console.error("[Calendar] Failed to find daily notes folder:", err);
        }
        store.set({});
        hasError = true;
      }
    },
    ...store,
  };
}

function createWeeklyNotesStore() {
  let hasError = false;
  const store = writable<Record<string, TFile> | null>(null);
  return {
    reindex: () => {
      try {
        const weeklyNotes = getAllWeeklyNotes();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store.set(weeklyNotes as any);
        hasError = false;
      } catch (err) {
        if (!hasError) {
          // Show user-facing error notification
          new Notice(
            "Calendar: Unable to load weekly notes. Please check your Weekly Notes or Periodic Notes plugin settings.",
            5000
          );
          console.error("[Calendar] Failed to find weekly notes folder:", err);
        }
        store.set({});
        hasError = true;
      }
    },
    ...store,
  };
}

export const settings = writable<ISettings>(defaultSettings);
export const dailyNotes = createDailyNotesStore();
export const weeklyNotes = createWeeklyNotesStore();

function createSelectedFileStore() {
  const store = writable<string | null>(null);

  return {
    setFile: (file: TFile | null) => {
      const id = getDateUIDFromFile(file);
      store.set(id);
    },
    ...store,
  };
}

export const activeFile = createSelectedFileStore();
