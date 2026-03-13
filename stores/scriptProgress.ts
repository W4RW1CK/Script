/**
 * stores/scriptProgress.ts — 2.6 Script execution progress (in-memory)
 *
 * Persists script execution state across tab switches (Zustand in-memory only).
 * Does NOT survive app restarts — intentional (scripts reset on fresh open).
 *
 * Tracks one active execution per scriptId. If the user returns to the same
 * script, they resume where they left off.
 */
import { create } from "zustand";

interface ScriptProgressEntry {
  scriptId:          string;
  currentBlockIndex: number;
  selectedOption:    string | null;
  isComplete:        boolean;
}

interface ScriptProgressStore {
  /** Map of scriptId → progress */
  progress: Record<string, ScriptProgressEntry>;
  /** Update progress for a specific script */
  setProgress: (scriptId: string, entry: Partial<ScriptProgressEntry>) => void;
  /** Get progress for a specific script (undefined = no saved progress) */
  getProgress: (scriptId: string) => ScriptProgressEntry | undefined;
  /** Clear progress for a script (on explicit restart or completion) */
  clearProgress: (scriptId: string) => void;
}

export const useScriptProgressStore = create<ScriptProgressStore>((set, get) => ({
  progress: {},

  setProgress: (scriptId, entry) => {
    const current = get().progress[scriptId] ?? {
      scriptId,
      currentBlockIndex: 0,
      selectedOption:    null,
      isComplete:        false,
    };
    set((state) => ({
      progress: {
        ...state.progress,
        [scriptId]: { ...current, ...entry, scriptId },
      },
    }));
  },

  getProgress: (scriptId) => get().progress[scriptId],

  clearProgress: (scriptId) => {
    set((state) => {
      const next = { ...state.progress };
      delete next[scriptId];
      return { progress: next };
    });
  },
}));
