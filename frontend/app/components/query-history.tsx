"use client";

import { useMainStore } from "@/store/mainStore";

export default function QueryHistory() {
    const {
        queryPairsHistory,
        setCurrentQueryPair,
    } = useMainStore()

    

    return (
        <section className="">
            <h2 className="text-2xl font-bold pb-4">History</h2>
            {queryPairsHistory.map((item, idx) => {
                return <div key={idx} onClick={() => setCurrentQueryPair(item)}>Query {item.query_id} - {item.scheme_used} </div>
            })}
        </section>
    )
}