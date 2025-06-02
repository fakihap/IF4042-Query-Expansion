"use server";

import { WeightingSchemes } from "@/store/querySettingsStore";

export async function getDocuments() {
    const res = await fetch("http://localhost:8000/documents", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return await res.json();
}

export async function startSearch({queries, useStemming, useStopwordElim, tfMode, useIDF, useNormalize, numberExpansionWords}: {
    queries: string[],
    useStemming: boolean,
    useStopwordElim: boolean,
    tfMode: string, // TODO: change to enum
    useIDF: boolean, 
    useNormalize: boolean,
    numberExpansionWords: number
}) {
    const res = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            queries: queries,
            useStemming: useStemming,
            useStopwordElim: useStopwordElim,
            tfMode: tfMode,
            useIDF: useIDF,
            useNormalize: useNormalize,
            numberExpansionWords: numberExpansionWords
        })
    });

    const result = await res.json()

    return result
}

export async function searchInvertedFile({document_id, useStemming, useStopwordElim, tfMode, useIDF, useNormalize}: {
    document_id: number,
    useStemming: boolean,
    useStopwordElim: boolean,
    tfMode: string, // TODO: change to enum
    useIDF: boolean, 
    useNormalize: boolean,
}) {
    const res = await fetch("http://localhost:8000/search/inverted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            document_id: document_id,
            useStemming: useStemming,
            useStopwordElim: useStopwordElim,
            tfMode: tfMode,
            useIDF: useIDF,
            useNormalize: useNormalize,
        })
    });

    const result = await res.json()

    return result
}

export async function getQueryPairs() {
    const res = await fetch("http://localhost:8000/pairs", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return await res.json();
}

export async function getQuery(id: number) {
    const res = await fetch("http://localhost:8000/queries/" + id, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return await res.json();
}