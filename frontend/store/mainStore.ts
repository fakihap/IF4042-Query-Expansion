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

type QueryResult = {
  document_id: number,
  similarity: number
}

export type Document = {
  id: number,
  title: string,
  author: string,
  content: string,
}

interface MainState {
  currentQueryPair: QueryPair | null
  queryPairsHistory: QueryPair[]
  openSidebar: boolean
  currentQueryResult: QueryResult[][]
  setCurrentQueryPair: (queryPair: QueryPair) => void
  setQueryPairsHistory: (queryPairs: QueryPair[]) => void
  setOpenSidebar: (status: boolean) => void
  setCurrentQueryResult: (queryResults: QueryResult[][]) => void
}

export const useMainStore = create<MainState>((set) => ({
  currentQueryPair: null,
  queryPairsHistory: [],
  openSidebar: true,
  currentQueryResult: [],
  setCurrentQueryPair: (queryPair) => set({currentQueryPair: queryPair}),
  setQueryPairsHistory: (queryPairs) => set({queryPairsHistory: queryPairs}),
  setOpenSidebar: (status) => set({openSidebar: status}),
  setCurrentQueryResult: (queryResults) => set({currentQueryResult: queryResults})
}))