"use client";

import { useState, useEffect } from "react";
import { getDocuments, getQueryPairs, getQuery } from "./actions";
import { useMainStore } from "@/store/mainStore";
import type { Query } from "@/store/mainStore";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import QuerySettings from "./components/query-settings";
import QueryHistory from "./components/query-history";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SearchCheck, PanelLeft, ArrowRight, ArrowLeft } from "lucide-react";
import SearchSettings from "./components/search-settings";
import DocumentList from "./components/document-list";
import InvertedViewer from "./components/inverted-viewer";

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
    // const fetchHistory = async() => {
    //   const queryPairs = await getQueryPairs()

    //   setQueryPairsHistory(queryPairs)
    // }

    // fetchHistory()
  }, [])

  // query selectable
  useEffect(() => {
    if (!currentQueryPair)
      return

    // const fetchQueryPair = async() => {
    //   const queryPair: Query = await getQuery(currentQueryPair?.query_id)

    //   setCurrentViewableQuery({
    //     id: queryPair.id,
    //     content: queryPair.content,
    //     search_result: queryPair.search_result,
    //     is_expansion: queryPair.is_expansion,
    //   })
    // }
  
    // fetchQueryPair()
  }, [currentQueryPair]) // add one more on button press
  
  return (
    <div className={`grid ${openSidebar ? "grid-cols-[20rem_1fr]" : "grid-cols-[0_1fr]"} h-screen duration-300`}>
      {/* sidebar */}
      <aside className={`${openSidebar ? "fixed top-0 left-0 h-full bg-sidebar px-8 py-12 transition-all duration-300 z-20 w-80 opacity-100" : "opacity-100 w-0 h-screen bg-sidebar px-8 py-12"}`}>
        <section className={`flex flex-col gap-8 ${openSidebar ? "" : "hidden"}`}>
          <SearchSettings />
          <Separator />
          {/* <InvertedViewer /> */}
        </section>
      </aside>

      {/* main - container */}
      <main className={`h-full bg-sidebar col-start-2 grid ${openSidebar ? "grid-rows-[0rem_1fr]" :"grid-rows-[0rem_1fr]"} duration-300`}>
        {/* main - content */}
        <Tabs defaultValue="search" asChild>
          <section className={`h-full w-full row-start-2 bg-background  grid ${openSidebar ? "grid-cols-[18rem_1fr_16rem]" : "grid-cols-[20rem_1fr_20rem] rounded-none"} px-8 py-8 duration-300`}>
            {/* <div className="flex px-4 py-2 text-xl font-bold"><SearchCheck  />GAN</div> */}
            <aside className="flex gap-3 h-[36px]">
              <PanelLeft size={36} strokeWidth={2} className="cursor-pointer hover:bg-gray-600 rounded-xs p-1" onClick={() => setOpenSidebar(!openSidebar)}/>
              <Separator orientation="vertical" />
              <TabsList>
                <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="search">Search</TabsTrigger>
                <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="browse">Browse</TabsTrigger>
              </TabsList>
            </aside>
            
            {/* Main Section */}
            <TabsContent value="search">
              <section className="flex items-center justify-center flex-col w-full mt-8 gap-4 overflow-x-hidden">
                <section className="w-full flex gap-6 py-2">
                  <Input className="rounded-xs" placeholder="Search Document" />
                  <span className="flex gap-2">
                    <Button variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs">
                      <Search />
                      Search
                    </Button> 
                    <Button variant={"outline"}  className="px-4 py-2 hover:cursor-pointer rounded-xs">
                      From File
                    </Button> 
                  </span>
                </section>

                <section className="flex flex-col w-full h-full gap-4">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mt-4">Search Results</h2>
                      {/* <div className="text-gray-400">Showing results x from y documents</div> */}
                    </div>
                    <div className="flex flex-col">
                      <Button variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs">
                        Download Results
                      </Button> 
                      <Button variant={"outline"}  className="px-4 py-2 hover:cursor-pointer rounded-xs" disabled>
                        MAP: 99.99
                      </Button> 
                    </div>
                  </div>

                  <QuerySettings/>
                  <DocumentList/>
                </section>
              </section>
            </TabsContent>

            <TabsContent value="browse">
              <InvertedViewer/>
              
            </TabsContent>

          </section>
        </Tabs>
      </main>
    </div>
  );
}
