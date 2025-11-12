import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import { appHasDailyNotesPluginLoaded } from "obsidian-daily-notes-interface";
import type { ILocaleOverride, IWeekStartOption } from "obsidian-calendar-ui";

import { DEFAULT_WEEK_FORMAT, DEFAULT_WORDS_PER_DOT } from "src/constants";
import type { ObsidianInternalApp } from "src/types";

import type CalendarPlugin from "./main";

/**
 * Plugin settings interface
 */
export interface ISettings {
  /** Number of words required to display one dot on a calendar date */
  wordsPerDot: number;
  /** Which day of the week to start the calendar on */
  weekStart: IWeekStartOption;
  /** Whether to show a confirmation dialog before creating new notes */
  shouldConfirmBeforeCreate: boolean;

  // Weekly Note settings
  /** Whether to show week numbers in the calendar */
  showWeeklyNote: boolean;
  /** Date format string for weekly note filenames */
  weeklyNoteFormat: string;
  /** Template file to use when creating weekly notes */
  weeklyNoteTemplate: string;
  /** Folder where weekly notes should be created */
  weeklyNoteFolder: string;

  /** Locale override for date formatting */
  localeOverride: ILocaleOverride;
}

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/**
 * Default plugin settings.
 * Frozen to prevent accidental mutations.
 */
export const defaultSettings = Object.freeze({
  shouldConfirmBeforeCreate: true,
  weekStart: "locale" as IWeekStartOption,

  wordsPerDot: DEFAULT_WORDS_PER_DOT,

  showWeeklyNote: false,
  weeklyNoteFormat: "",
  weeklyNoteTemplate: "",
  weeklyNoteFolder: "",

  localeOverride: "system-default",
});

/**
 * Checks if the Periodic Notes plugin is loaded and has weekly notes enabled.
 *
 * @returns True if Periodic Notes plugin is loaded with weekly notes enabled, false otherwise
 */
export function appHasPeriodicNotesPluginLoaded(): boolean {
  const periodicNotes = (window.app as ObsidianInternalApp).plugins.getPlugin("periodic-notes");
  return periodicNotes && (periodicNotes as any).settings?.weekly?.enabled;
}

/**
 * Settings tab for the Calendar plugin.
 * Provides UI for configuring calendar behavior, weekly notes, and display options.
 */
export class CalendarSettingsTab extends PluginSettingTab {
  private plugin: CalendarPlugin;

  constructor(app: App, plugin: CalendarPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  /**
   * Displays the settings UI.
   * Shows warnings if Daily Notes plugin is not enabled, and conditionally
   * displays weekly note settings based on configuration.
   */
  display(): void {
    this.containerEl.empty();

    if (!appHasDailyNotesPluginLoaded()) {
      this.containerEl.createDiv("settings-banner", (banner) => {
        banner.createEl("h3", {
          text: "⚠️ Daily Notes plugin not enabled",
        });
        banner.createEl("p", {
          cls: "setting-item-description",
          text:
            "The calendar is best used in conjunction with either the Daily Notes plugin or the Periodic Notes plugin (available in the Community Plugins catalog).",
        });
      });
    }

    this.containerEl.createEl("h3", {
      text: "General Settings",
    });
    this.addDotThresholdSetting();
    this.addWeekStartSetting();
    this.addConfirmCreateSetting();
    this.addShowWeeklyNoteSetting();

    if (
      this.plugin.options.showWeeklyNote &&
      !appHasPeriodicNotesPluginLoaded()
    ) {
      this.containerEl.createEl("h3", {
        text: "Weekly Note Settings",
      });
      this.containerEl.createEl("p", {
        cls: "setting-item-description",
        text:
          "Note: Weekly Note settings are moving. You are encouraged to install the 'Periodic Notes' plugin to keep the functionality in the future.",
      });
      this.addWeeklyNoteFormatSetting();
      this.addWeeklyNoteTemplateSetting();
      this.addWeeklyNoteFolderSetting();
    }

    this.containerEl.createEl("h3", {
      text: "Advanced Settings",
    });
    this.addLocaleOverrideSetting();
  }

  addDotThresholdSetting(): void {
    new Setting(this.containerEl)
      .setName("Words per dot")
      .setDesc("How many words should be represented by a single dot?")
      .addText((textfield) => {
        textfield.setPlaceholder(String(DEFAULT_WORDS_PER_DOT));
        textfield.inputEl.type = "number";
        textfield.inputEl.min = "1";
        textfield.setValue(String(this.plugin.options.wordsPerDot));
        textfield.onChange(async (value) => {
          // Validate input
          const numValue = Number(value);

          if (value === "") {
            // Empty value - reset to default
            this.plugin.writeOptions(() => ({
              wordsPerDot: DEFAULT_WORDS_PER_DOT,
            }));
            textfield.setValue(String(DEFAULT_WORDS_PER_DOT));
            return;
          }

          if (isNaN(numValue) || numValue <= 0 || !Number.isInteger(numValue)) {
            // Invalid input - show error and revert
            new Notice("Calendar: Words per dot must be a positive whole number", 5000);
            textfield.setValue(String(this.plugin.options.wordsPerDot));
            return;
          }

          // Valid input - save it
          this.plugin.writeOptions(() => ({
            wordsPerDot: numValue,
          }));
        });
      });
  }

  addWeekStartSetting(): void {
    const { moment } = window;

    const localizedWeekdays = moment.weekdays();
    const localeWeekStartNum = window._bundledLocaleWeekSpec.dow;
    const localeWeekStart = moment.weekdays()[localeWeekStartNum];

    new Setting(this.containerEl)
      .setName("Start week on:")
      .setDesc(
        "Choose what day of the week to start. Select 'Locale default' to use the default specified by moment.js"
      )
      .addDropdown((dropdown) => {
        dropdown.addOption("locale", `Locale default (${localeWeekStart})`);
        localizedWeekdays.forEach((day, i) => {
          dropdown.addOption(weekdays[i], day);
        });
        dropdown.setValue(this.plugin.options.weekStart);
        dropdown.onChange(async (value) => {
          this.plugin.writeOptions(() => ({
            weekStart: value as IWeekStartOption,
          }));
        });
      });
  }

  addConfirmCreateSetting(): void {
    new Setting(this.containerEl)
      .setName("Confirm before creating new note")
      .setDesc("Show a confirmation modal before creating a new note")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.options.shouldConfirmBeforeCreate);
        toggle.onChange(async (value) => {
          this.plugin.writeOptions(() => ({
            shouldConfirmBeforeCreate: value,
          }));
        });
      });
  }

  addShowWeeklyNoteSetting(): void {
    new Setting(this.containerEl)
      .setName("Show week number")
      .setDesc("Enable this to add a column with the week number")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.options.showWeeklyNote);
        toggle.onChange(async (value) => {
          this.plugin.writeOptions(() => ({ showWeeklyNote: value }));
          this.display(); // show/hide weekly settings
        });
      });
  }

  addWeeklyNoteFormatSetting(): void {
    new Setting(this.containerEl)
      .setName("Weekly note format")
      .setDesc("For more syntax help, refer to format reference")
      .addText((textfield) => {
        textfield.setValue(this.plugin.options.weeklyNoteFormat);
        textfield.setPlaceholder(DEFAULT_WEEK_FORMAT);
        textfield.onChange(async (value) => {
          // Trim whitespace and validate
          const trimmedValue = value.trim();

          // Check for potentially dangerous characters
          if (trimmedValue.includes("..") || /[<>:"|?*\x00-\x1f]/.test(trimmedValue)) {
            new Notice("Calendar: Weekly note format contains invalid characters", 5000);
            textfield.setValue(this.plugin.options.weeklyNoteFormat);
            return;
          }

          this.plugin.writeOptions(() => ({ weeklyNoteFormat: trimmedValue }));
        });
      });
  }

  addWeeklyNoteTemplateSetting(): void {
    new Setting(this.containerEl)
      .setName("Weekly note template")
      .setDesc(
        "Choose the file you want to use as the template for your weekly notes"
      )
      .addText((textfield) => {
        textfield.setValue(this.plugin.options.weeklyNoteTemplate);
        textfield.onChange(async (value) => {
          // Trim whitespace and validate
          const trimmedValue = value.trim();

          // Check for path traversal and invalid characters
          if (trimmedValue.includes("..") || /[<>:"|?*\x00-\x1f]/.test(trimmedValue)) {
            new Notice("Calendar: Template path contains invalid characters", 5000);
            textfield.setValue(this.plugin.options.weeklyNoteTemplate);
            return;
          }

          this.plugin.writeOptions(() => ({ weeklyNoteTemplate: trimmedValue }));
        });
      });
  }

  addWeeklyNoteFolderSetting(): void {
    new Setting(this.containerEl)
      .setName("Weekly note folder")
      .setDesc("New weekly notes will be placed here")
      .addText((textfield) => {
        textfield.setValue(this.plugin.options.weeklyNoteFolder);
        textfield.onChange(async (value) => {
          // Trim whitespace and validate
          const trimmedValue = value.trim();

          // Check for path traversal and invalid characters
          if (trimmedValue.includes("..") || /[<>:"|?*\x00-\x1f]/.test(trimmedValue)) {
            new Notice("Calendar: Folder path contains invalid characters", 5000);
            textfield.setValue(this.plugin.options.weeklyNoteFolder);
            return;
          }

          this.plugin.writeOptions(() => ({ weeklyNoteFolder: trimmedValue }));
        });
      });
  }

  addLocaleOverrideSetting(): void {
    const { moment } = window;

    const sysLocale = navigator.language?.toLowerCase();

    new Setting(this.containerEl)
      .setName("Override locale:")
      .setDesc(
        "Set this if you want to use a locale different from the default"
      )
      .addDropdown((dropdown) => {
        dropdown.addOption("system-default", `Same as system (${sysLocale})`);
        moment.locales().forEach((locale) => {
          dropdown.addOption(locale, locale);
        });
        dropdown.setValue(this.plugin.options.localeOverride);
        dropdown.onChange(async (value) => {
          this.plugin.writeOptions(() => ({
            localeOverride: value as ILocaleOverride,
          }));
        });
      });
  }
}
