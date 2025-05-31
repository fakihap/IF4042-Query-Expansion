"use server";

import { WeightingSchemes } from "@/store/querySettingsStore";

export async function getDocuments() {
    const res = await fetch("http://localhost:8000/documents", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return await res.json();
}

export async function startSearch({queries, useStemming, useStopwordElim, tfMode, useIDF, useNormalize}: {
    queries: string[],
    useStemming: boolean,
    useStopwordElim: boolean,
    tfMode: string, // TODO: change to enum
    useIDF: boolean, 
    useNormalize: boolean,
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
        })
    });

    const result = await res.json().then(data => console.log('POST response:', data, data.result))
                        .catch(error => console.error('Error:', error));

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