"use client";

import { useEffect } from "react";
import { getDocuments } from "./actions";

import { useMainStore, Document, useSearchStore, useBatchSearchStore, useSearchResultStore } from "@/store/mainStore";
import { useUiStore } from "@/store/uiStore";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { PanelLeft } from "lucide-react";

import SearchSettings from "../components/search-settings";
import InvertedViewer from "../components/inverted-viewer";
import SearchResult from "@/components/search/search-results";

export default function Home() {
  const {
    currentQueryPair,
    openSidebar,
    currentQueryResult,
    setOpenSidebar,
  } = useMainStore()


  const {
      searchDisabled, 
  } = useUiStore()

  const {
    setCurrentDocumets,
  } = useSearchResultStore()

  const {
    setCurrentSearchPrompt
  } = useSearchStore()

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

  useEffect(() => {
    const fetchDocuments = async() => {
      const docs = await getDocuments()
      console.log('setting docs', docs)
      setCurrentDocumets(docs)
    }

    fetchDocuments()
  }, [])

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
            {/* Left Section */}
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
              <SearchResult />
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
