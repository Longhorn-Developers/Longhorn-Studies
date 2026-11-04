import { createContext, use, useState, type ReactNode } from "react";

export const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"] as const;
export type Year = (typeof YEARS)[number];

export const NOISE_LEVELS = ["Quiet", "Collaborative"] as const;
export type NoiseLevel = (typeof NOISE_LEVELS)[number];

export const AREA_TYPES = ["Indoor", "Outdoor"] as const;
export type AreaType = (typeof AREA_TYPES)[number];

export const AMENITIES = [
  "Outlets",
  "Printers",
  "Computers",
  "Whiteboards",
  "TV/Projector",
  "Near drinks",
  "Near food",
] as const;
export type Amenity = (typeof AMENITIES)[number];

/** Everything the user enters during onboarding. Later steps add their fields here. */
export type OnboardingAnswers = {
  photoUri: string | null;
  firstName: string;
  lastName: string;
  username: string;
  year: Year | null;
  majors: string;
  noiseLevel: NoiseLevel | null;
  areaType: AreaType | null;
  amenities: Amenity[];
};

const EMPTY: OnboardingAnswers = {
  photoUri: null,
  firstName: "",
  lastName: "",
  username: "",
  year: null,
  majors: "",
  noiseLevel: null,
  areaType: null,
  amenities: [],
};

/** Letters, numbers and dashes, at least 3. Stored without the "@" (the field shows it). */
export function isValidUsername(username: string) {
  return /^[a-z0-9-]{3,}$/i.test(username);
}

/** Extra checks beyond "has a value", per field. */
const VALIDATORS: { [K in keyof OnboardingAnswers]?: (value: OnboardingAnswers[K]) => boolean } = {
  username: isValidUsername,
};

/** True when every listed field has a value (non-blank text, non-null choice, non-empty list) that passes its validator. */
export function hasAnswers(answers: OnboardingAnswers, fields: readonly (keyof OnboardingAnswers)[]) {
  return fields.every((f) => {
    const v = answers[f];
    const filled = typeof v === "string" ? v.trim() !== "" : Array.isArray(v) ? v.length > 0 : v != null;
    const validate = VALIDATORS[f] as ((value: typeof v) => boolean) | undefined;
    return filled && (validate?.(v) ?? true);
  });
}

type AnswersContext = {
  answers: OnboardingAnswers;
  /** Merge in changes, e.g. `update({ firstName: "Meg" })`. */
  update: (changes: Partial<OnboardingAnswers>) => void;
};

const Context = createContext<AnswersContext | null>(null);

/** Wraps the onboarding stack so answers survive going back and forth between steps. */
export function OnboardingAnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState(EMPTY);
  const update = (changes: Partial<OnboardingAnswers>) => setAnswers((a) => ({ ...a, ...changes }));
  return <Context value={{ answers, update }}>{children}</Context>;
}

export function useOnboardingAnswers() {
  const ctx = use(Context);
  if (!ctx) throw new Error("useOnboardingAnswers must be used inside OnboardingAnswersProvider");
  return ctx;
}
