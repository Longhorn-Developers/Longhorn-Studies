import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

/**
 * Whether the user has finished onboarding, saved on the device.
 * Uses the same localStorage as the Supabase session (expo-sqlite on native, the browser on web).
 */
const KEY = "onboarding:complete";

// No localStorage during web server rendering (web.output: "server").
const isServer = typeof window === "undefined";

let complete = !isServer && localStorage.getItem(KEY) === "true";
const listeners = new Set<() => void>();

function set(value: boolean) {
  complete = value;
  if (value) localStorage.setItem(KEY, "true");
  else localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Re-renders when onboarding is completed or reset. */
export function useOnboardingComplete() {
  return useSyncExternalStore(
    subscribe,
    () => complete,
    () => false
  );
}

/** Call on the last onboarding screen. The router then switches to the tabs. */
export function completeOnboarding() {
  set(true);
}

/** Dev only: clears the flag so onboarding shows again. */
export function resetOnboarding() {
  if (!__DEV__) return;
  set(false);
}
