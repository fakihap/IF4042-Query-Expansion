"use server";

export async function getDocuments() {
    const res = await fetch("http://localhost:8000/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    return await res.json();
}