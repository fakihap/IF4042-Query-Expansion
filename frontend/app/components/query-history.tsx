"use client";

import { Fragment } from "react";
import { useMainStore } from "@/store/mainStore";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function QueryHistory() {
    const {
        queryPairsHistory,
        currentViewableQuery,
        setCurrentQueryPair,
    } = useMainStore()

    return (
        <section className="h-full">
            <h2 className="text-2xl font-bold pb-4">History</h2>
            <ScrollArea className="h-128 w-full rounded-xs border">
                <section className="p-4">
                    {queryPairsHistory.map((item, idx) => 
                    <Fragment key={idx}>
                        <div 
                            className={`cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm px-4 py-1 ${currentViewableQuery?.id == item.query_id ? "bg-primary" : ""}`}
                            onClick={() => setCurrentQueryPair(item)}>
                            Query {item.query_id} - {item.scheme_used} 
                        </div>
                        <Separator className="mt-2" />
                    </Fragment>
                    )}
                </section>
            </ScrollArea>
        </section>
    )
}