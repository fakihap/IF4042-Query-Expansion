"use client";

import { useState, useEffect } from "react";

import { getDocuments, getQueryPairs, getQuery } from "./actions";

import { useMainStore } from "@/store/mainStore";
import type { Query } from "@/store/mainStore";


import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import QuerySettings from "./components/query-settings";
import QueryHistory from "./components/query-history";

import { ScrollArea } from "@/components/ui/scroll-area";

import { SearchCheck, AlignLeft } from "lucide-react";


export default function Home() {
  const {
    currentQueryPair,
    queryPairsHistory,
    currentViewableQuery,
    openSidebar,
    setCurrentQueryPair,
    setQueryPairsHistory,
    setCurrentViewableQuery,
    setOpenSidebar,
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
    <div className={`grid ${openSidebar ? "grid-cols-[20rem_1fr]" : "grid-cols-[0_1fr]"} h-screen duration-300`}>
      {/* sidebar */}
      <aside className="opacity-100 w-full h-screen bg-sidebar px-8 py-12">
        <section className={`flex flex-col gap-8 ${openSidebar ? "" : "hidden"}`}>
          <QuerySettings />
          <Separator />
          <QueryHistory />
        </section>
      </aside>

      {/* main - container */}
      <main className={`h-full bg-sidebar col-start-2 grid ${openSidebar ? "grid-rows-[4rem_1fr]" :"grid-rows-[0rem_1fr]"} duration-300`}>
        {/* main - content */}
        <section className="h-full w-full row-start-2 bg-background rounded-xl grid grid-cols-[20rem_1fr_20rem] px-8 py-8">
          {/* <div className="flex px-4 py-2 text-xl font-bold"><SearchCheck  />GAN</div> */}
          <AlignLeft size={32} strokeWidth={2} className="cursor-pointer" onClick={() => setOpenSidebar(!openSidebar)}/>
          {/* Main Section */}
          <ScrollArea className="flex items-center justify-center flex-col w-full mt-8 gap-4">
          { 
            currentViewableQuery ? 
            <Card className="bg-card w-full h-[4rem] ">{currentViewableQuery.content}</Card>
            :
            <Card className="bg-card w-full h-[4rem] ">non selected - {currentQueryPair && currentQueryPair.query_id}</Card>
          }
          </ScrollArea>
         

        </section>
      </main>
    </div>
  );
}
