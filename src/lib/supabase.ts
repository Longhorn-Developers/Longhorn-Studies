import "expo-sqlite/localStorage/install";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// No localStorage during web server rendering (web.output: "server"); fall back to an in-memory session there.
const isServer = typeof window === "undefined";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: isServer ? undefined : localStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    // Android and iOS have no URL to read a session from.
    detectSessionInUrl: false,
  },
});

// Only refresh auth tokens while the app is in the foreground.
if (!isServer) {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
