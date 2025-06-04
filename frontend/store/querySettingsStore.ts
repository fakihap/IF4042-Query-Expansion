import { create } from "zustand";

export const WeightingSchemes = {
  logarithmic: "Logarithmic",
  binary: "Binary",
  augmented: "Augmented",
  natural: "Natural",
  no: "No Weighting",
} as const
export type WeightingScheme = typeof WeightingSchemes[keyof typeof WeightingSchemes]

interface QuerySettingsState {
  useStemming: boolean
  useStopWordElim: boolean
  weightingScheme: WeightingScheme
  useIDF: boolean
  useNormalization: boolean
  numberExpansionWords: number
  setUseStemming: (value: boolean) => void
  setStopWordElim: (value: boolean) => void
  setWeightingScheme: (scheme: WeightingScheme) => void
  setUseIDF: (value: boolean) => void
  setUseNormalization: (value: boolean) => void
  setNumberExpansionWords: (value: number) => void
}

export const useQuerySettingsStore = create<QuerySettingsState>((set) => ({
  useStemming: false,
  useStopWordElim: false,
  weightingScheme: "Logarithmic",
  useIDF: false,
  useNormalization: false,
  numberExpansionWords: 4,
  setUseStemming: (value) => set({ useStemming: value }),
  setStopWordElim: (value) => set({ useStopWordElim: value }),
  setWeightingScheme: (scheme) => set({ weightingScheme: scheme }),
  setUseIDF: (value) => set({ useIDF: value }),
  setUseNormalization: (value) => set({ useNormalization: value }),
  setNumberExpansionWords: (value) => set({ numberExpansionWords: value})
}))



type WeightingSchemeKey = keyof typeof WeightingSchemes;
type WeightingSchemeLabel = typeof WeightingSchemes[WeightingSchemeKey];

export function getWeightingSchemeKey(label: WeightingSchemeLabel): WeightingSchemeKey {
  const entries = Object.entries(WeightingSchemes) as [WeightingSchemeKey, WeightingSchemeLabel][];
  const found = entries.find(([_, v]) => v === label);
  return found![0]; // NOTE: i forced this to exist
}