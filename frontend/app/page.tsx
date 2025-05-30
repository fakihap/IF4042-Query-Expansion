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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <section className={`h-full w-full row-start-2 bg-background rounded-xl grid ${openSidebar ? "grid-cols-[10rem_1fr_10rem]" : "grid-cols-[20rem_1fr_20rem]"} px-8 py-8 duration-300`}>
          {/* <div className="flex px-4 py-2 text-xl font-bold"><SearchCheck  />GAN</div> */}
          <AlignLeft size={32} strokeWidth={2} className="cursor-pointer" onClick={() => setOpenSidebar(!openSidebar)}/>
          {/* Main Section */}
          <section className="flex items-center justify-center flex-col w-full mt-8 gap-4">
            <section className="w-full flex gap-8 py-2">
              <Input className="rounded-sm" placeholder="Search Document" />
              <span className="flex">
                <Button variant={"secondary"} size={"sm"} className="px-8 py-2 hover:cursor-pointer">
                  Search
                </Button> 
                <Button variant={"outline"} className="px-8 py-2 hover:cursor-pointer">
                  From File
                </Button> 
              </span>
            </section>

            <section className="flex flex-col w-full h-full gap-4">
              <h2 className="text-2xl font-bold pb-2 mt-4">Search Results</h2>
              <div className="text-gray-400">showing results x from y documents</div>
              <ScrollArea className="w-full h-full">
              { 
                currentViewableQuery ? 
                <Card className="bg-card w-full h-[4rem] ">{currentViewableQuery.content}</Card>
                :
                <Card className="bg-card w-full h-[4rem] ">non selected - {currentQueryPair && currentQueryPair.query_id}</Card>
              }
              </ScrollArea>
            </section>

            
          
          </section>
         

        </section>
      </main>
    </div>
  );
}
