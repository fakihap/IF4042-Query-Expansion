import { create } from "zustand";

import { WeightingScheme } from "./querySettingsStore";

type QueryPair = {
  query_id: number,
  expanded_query_id: number,

  terms_expanded: number,

  used_stemming: boolean,
  removed_stopword: boolean,
  scheme_used: WeightingScheme,
}

export type Query = {
  id: number,
  content: string,
  search_result?: number,
  is_expansion: boolean,
}

interface MainState {
  currentQueryPair: QueryPair | null
  queryPairsHistory: QueryPair[]
  currentViewableQuery: Query | null
  setCurrentQueryPair: (queryPair: QueryPair) => void
  setQueryPairsHistory: (queryPairs: QueryPair[]) => void
  setCurrentViewableQuery: (query: Query) => void
}

export const useMainStore = create<MainState>((set) => ({
  currentQueryPair: null,
  queryPairsHistory: [],
  currentViewableQuery: null,
  setCurrentQueryPair: (queryPair) => set({currentQueryPair: queryPair}),
  setQueryPairsHistory: (queryPairs) => set({queryPairsHistory: queryPairs}),
  setCurrentViewableQuery: (query) => set({currentViewableQuery: query}),
}))