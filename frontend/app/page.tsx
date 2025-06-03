"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { getDocuments, getQueryPairs, getQuery, startSearch } from "./actions";
import { useMainStore, Document } from "@/store/mainStore";
import { useQuerySettingsStore } from "@/store/querySettingsStore";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import QuerySettings from "./components/query-settings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SearchCheck, PanelLeft, ArrowRight, ArrowLeft, Weight } from "lucide-react";
import SearchSettings from "./components/search-settings";
import DocumentList from "./components/document-list";
import InvertedViewer from "./components/inverted-viewer";
import WeightTable from "./components/weight-table";

export default function Home() {
  const {
    currentQueryPair,
    queryPairsHistory,
    openSidebar,
    currentQueryResult,
    setCurrentQueryPair,
    setQueryPairsHistory,
    setOpenSidebar,
    setCurrentQueryResult,
  } = useMainStore()

  const {
    useStemming,
    useStopWordElim,
    weightingScheme,
    useIDF,
    useNormalization,
    numberExpansionWords
  } = useQuerySettingsStore()

  const [searchPrompt, setSearchPrompt] = useState<string>()
  const [documents, setDocuments] = useState<Document[]>([])
  const [expansion, setExpansion] = useState<string[]>([])
  const [currentWeight, setCurrentWeight] = useState<number[][]>([])
  const [currentVocabulary, setCurrentVocabulary] = useState<string[]>([])

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
      setDocuments(docs)
    }

    fetchDocuments()
  }, [])

  const handleStartSearch = async () => {
    const res = await startSearch({
      queries: [searchPrompt ?? ''], // TODO: later deal with "from file" inputs
      useStemming: useStemming,
      useStopwordElim: useStopWordElim,
      tfMode: "augmented", // TODO: change to enum
      useIDF: useIDF, 
      useNormalize: useNormalization,
      numberExpansionWords: numberExpansionWords
    })
    // .then(data => console.log('POST ', data, data.result))
    // .then(data => setCurrentQueryResult(data)) ///////////////////////
    setCurrentQueryResult(res.result[0])
    setExpansion(res.result[0][1])
    setCurrentWeight([res.result[0][2], res.result[0][3]])
    setCurrentVocabulary(res.result[0][4])
  }

  const handleBatchSearch = async () => {
    const res = await startSearch({
      queries: queryBatch, // TODO: later deal with "from file" inputs
      useStemming: useStemming,
      useStopwordElim: useStopWordElim,
      tfMode: "augmented", // TODO: change to enum
      useIDF: useIDF, 
      useNormalize: useNormalization,
      numberExpansionWords: numberExpansionWords,
      batchRelevance: relBatch
    })
    setCurrentQueryResult(res.result[0])
    setExpansion(res.result[0][1])
    setCurrentWeight([res.result[0][2], res.result[0][3]])
    setCurrentVocabulary(res.result[0][4])
  }

  // read file
  const [queryBatch, setQueryBatch] = useState<string[]>([]);
  const [relBatch, setRelBatch] = useState<string[][]>([]);

  const handleFileRead = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) 
      return

    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target)
        return
      
      const content = e.target.result as string
      // console.log(content)
      const lineArray = content.split(/\r?\n/); // handles both \n and \r\n
      console.log(lineArray)
      let queryList: string[] = []
      let relList: string[][] = []

      lineArray.forEach((i) => {  
        
        const ctx = i.substring(i.indexOf(' ') + 1)
        const idx = ctx.indexOf(' ')

        if (i.startsWith('query')) {
          queryList.push(ctx.substring(idx+1))
        } else if (i.startsWith('rel')) {
          relList.push([ctx.substring(0, idx), ctx.substring(idx+1)])
        }
      })
3

      // console.log(queryList, relList)

      setQueryBatch(queryList)
      setRelBatch(relList)
    }

    reader.readAsText(file)
  };
  
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
                  <Input className="rounded-xs" placeholder="Search Document" onChange={(e) => setSearchPrompt(e.target.value)}/>
                  <span className="flex gap-2">
                    <Button variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs" onClick={handleStartSearch}>
                      <Search />
                      Search
                    </Button> 
                    <Button className="px-4 py-2 hover:cursor-pointer rounded-xs" asChild>
                      <Input type="file" onChange={(e) => handleFileRead(e)} />
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
                      <Button variant={"secondary"} onClick={() => {
                        console.log(relBatch, queryBatch)

                        handleBatchSearch()
                      }} className="px-8 py-2 hover:cursor-pointer rounded-xs">
                        Download Results
                      </Button> 
                      <Button variant={"outline"}  className="px-4 py-2 hover:cursor-pointer rounded-xs" disabled>
                        MAP: 99.99
                      </Button> 
                    </div>
                  </div>

                  <QuerySettings data={expansion}/>
                  <Tabs defaultValue="document" asChild>
                    <div>
                      <div className="w-full flex items-center justify-end gap-3 h-[36px]">
                        <TabsList>
                          <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="document">Document</TabsTrigger>
                          <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="weight">Weight</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="document">
                        {currentQueryResult.length > 0 &&
                          <DocumentList data={currentQueryResult[0].map(r => {
                            const relevantDoc = documents.filter(doc => doc.id == r.document_id)

                            // console.log({
                            //   title: relevantDoc[0].title,
                            //   abstract: relevantDoc[0].abstract,
                            //   ...r
                            // })


                            return {
                              title: relevantDoc[0].title,
                              abstract: relevantDoc[0].content,
                              ...r
                            }
                          })} />
                          }
                      </TabsContent>
                      <TabsContent value="weight">
                        <WeightTable data={currentWeight} vocab={currentVocabulary} />
                      </TabsContent>
                    </div>
                  </Tabs>

                  

                  
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
