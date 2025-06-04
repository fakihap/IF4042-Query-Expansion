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

// Search Store
interface SearchState {
  currentSearchPrompt: string
  setCurrentSearchPrompt: (searchPrompt: string) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  currentSearchPrompt: "",
  setCurrentSearchPrompt: (searchPrompt: string) => set({currentSearchPrompt: searchPrompt})
}))

// Fetch Result Store
interface SearchResultState {
  currentDocuments: Document[]
  currentExpansion: string[]
  currentWeight: number[][]
  currentVocabulary: string[]
  setCurrentDocumets: (documents: Document[]) => void
  setCurrentExpansion: (expansions: string[]) => void
  setCurrentWeight: (weights: number[][]) => void
  setCurrentVocabulary: (vocabularies: string[]) => void
}

export const useSearchResultStore = create<SearchResultState>((set) => ({
  currentDocuments: [],
  currentExpansion: [],
  currentWeight: [],
  currentVocabulary: [],
  setCurrentDocumets: (documents: Document[]) => set({currentDocuments: documents}),
  setCurrentExpansion: (expansions: string[]) => set({currentExpansion: expansions}),
  setCurrentWeight: (weights: number[][]) => set({currentWeight: weights}),
  setCurrentVocabulary: (vocabularies: string[]) => set({currentVocabulary: vocabularies}),
}))

// Batch Store
interface BatchSearchState {
  currentQueryBatch: string[]
  currentRelevanceBatch: {[key: number]: number[]} | undefined
  currentBatchIndex: number
  currentMAP: number
  setCurrentQueryBatch: (queryBatch: string[]) => void
  setCurrentRelevanceBatch: (relevanceBatch: {[key: number]: number[]}) => void
  setCurrentBatchIndex: (batchIndex: number) => void
  setCurrentMAP: (MAP: number) => void
}

export const useBatchSearchStore = create<BatchSearchState>((set) => ({
  currentQueryBatch: [],
  currentRelevanceBatch: undefined,
  currentBatchIndex: -1,
  currentMAP: 0,
  setCurrentQueryBatch: (queryBatch: string[]) => set({currentQueryBatch: queryBatch}),
  setCurrentRelevanceBatch: (relevanceBatch: {[key: number]: number[]}) => set({currentRelevanceBatch: relevanceBatch}),
  setCurrentBatchIndex: (batchIndex: number) => set({currentBatchIndex: batchIndex}),
  setCurrentMAP: (MAP: number) => set({currentMAP: MAP}),
}))