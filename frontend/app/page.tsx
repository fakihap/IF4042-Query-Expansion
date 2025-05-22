"use client";

import { useState, useEffect } from "react";

import { getDocuments, getQueryPairs, getQuery } from "./actions";

import { useMainStore } from "@/store/mainStore";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import QuerySettings from "./components/query-settings";
import QueryHistory from "./components/query-history";

import type { Query } from "@/store/mainStore";

export default function Home() {
  const {
    currentQueryPair,
    queryPairsHistory,
    currentViewableQuery,
    setCurrentQueryPair,
    setQueryPairsHistory,
    setCurrentViewableQuery,
  } = useMainStore()

  // history
  useEffect(() => {
    const fetchHistory = async() => {
      const queryPairs = await getQueryPairs()

      setQueryPairsHistory(queryPairs)
    }

    fetchHistory()
  }, [])

  // query selectable
  useEffect(() => {
    if (!currentQueryPair)
      return

    const fetchQueryPair = async() => {
      const queryPair: Query = await getQuery(currentQueryPair?.query_id)

      setCurrentViewableQuery({
        id: queryPair.id,
        content: queryPair.content,
        search_result: queryPair.search_result,
        is_expansion: queryPair.is_expansion,
      })
    }
  
    fetchQueryPair()
  }, [currentQueryPair]) // add one more on button press
  
  

  return (
    <div className="grid grid-cols-[20rem_1fr] h-screen">
      {/* sidebar */}
      <aside className="w-full h-screen bg-sidebar px-8 py-12 flex flex-col gap-8">
        <QuerySettings />
        <Separator />
        <QueryHistory />
      </aside>

      {/* main - container */}
      <main className="h-full bg-sidebar overflow-y-scroll">
        {/* main - content */}
        <section className="h-full w-full bg-background mt-8 rounded-xl grid grid-cols-[20rem_1fr_20rem] ">
          <div>QGAN</div>
          <section className="flex items-center justify-center flex-col w-full mt-8 gap-4">

          { 
            currentViewableQuery ? 
            <Card className="bg-card w-full h-[4rem] ">{currentViewableQuery.content}</Card>
            :
            <Card className="bg-card w-full h-[4rem] ">non selected - {currentQueryPair && currentQueryPair.query_id}</Card>
          }
          </section>
         

        </section>
      </main>
    </div>
  );
}
