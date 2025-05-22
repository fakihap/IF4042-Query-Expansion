"use server";

export async function getDocuments() {
    const res = await fetch("http://localhost:8000/documents", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return await res.json();
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