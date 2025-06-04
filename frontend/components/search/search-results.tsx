"use client"

import { useEffect, ChangeEvent } from "react";

import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search } from "lucide-react"

import DownloadButton from "../download-button"
import QuerySettings from "../query-settings"
import WeightTable from "../weight-table";
import DocumentList from "../document-list";

import { getWeightingSchemeKey } from "@/store/querySettingsStore";

import { startSearch } from "@/app/actions";

import { useUiStore } from "@/store/uiStore";
import { useMainStore, useSearchStore, useBatchSearchStore, useSearchResultStore } from "@/store/mainStore";
import { useQuerySettingsStore } from "@/store/querySettingsStore";

export default function SearchResult() {
    const {
        searchDisabled, 
        setSearchDisabled
    } = useUiStore()

    const {
        useStemming,
        useStopWordElim,
        weightingScheme,
        useIDF,
        useNormalization,
        numberExpansionWords
    } = useQuerySettingsStore()

    const {
        currentQueryResult,
        setCurrentQueryResult
    } = useMainStore()

    const {
        currentDocuments,
        currentExpansion,
        currentWeight,
        currentVocabulary,
        setCurrentExpansion,
        setCurrentWeight,
        setCurrentVocabulary,
    } = useSearchResultStore()
    

    const {
        currentSearchPrompt,
        setCurrentSearchPrompt
    } = useSearchStore()


    const {
        currentMAP,
        currentQueryBatch,
        currentRelevanceBatch,
        currentBatchIndex,
        setCurrentMAP,
        setCurrentQueryBatch,
        setCurrentRelevanceBatch,
    } = useBatchSearchStore()
    
    const handleFileRead = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) 
            return

        console.log('reading file')

        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target)
                return
            
            const content = e.target.result as string
            const lineArray = content.split(/\r?\n/)

            let queryList: string[] = []
            let relList: {[key: number]: number[]} = {}

            lineArray.forEach((i) => {  
                
                const ctx = i.substring(i.indexOf(' ') + 1)
                const idx = ctx.indexOf(' ')

                if (i.startsWith('query')) {
                queryList.push(ctx.substring(idx+1))
                } else if (i.startsWith('rel')) {
                if (!relList[parseInt(ctx.substring(0, idx))]) {
                    relList[parseInt(ctx.substring(0, idx))] = []
                }

                relList[parseInt(ctx.substring(0, idx))].push(parseInt(ctx.substring(idx+1)))
                }
            })

            setCurrentQueryBatch(queryList)
            setCurrentRelevanceBatch(relList)
            setSearchDisabled(true)
        }

        reader.readAsText(file)
    };

    const handleStartSearch = async () => {
        console.log(currentSearchPrompt)
        if (!currentSearchPrompt) {
            return
        }

        const res = await startSearch({
            query: currentSearchPrompt,
            useStemming: useStemming,
            useStopwordElim: useStopWordElim,
            tfMode: getWeightingSchemeKey(weightingScheme),
            useIDF: useIDF, 
            useNormalize: useNormalization,
            numberExpansionWords: numberExpansionWords
        })

        setCurrentQueryResult(res.result[0])
        setCurrentExpansion(res.result[0][1])
        setCurrentWeight([res.result[0][2], res.result[0][3]])
        setCurrentVocabulary(res.result[0][4])
    }
    

      // read batch
    useEffect(() => {
        setCurrentSearchPrompt(currentQueryBatch[currentBatchIndex])
    }, [searchDisabled, currentBatchIndex])
    
    useEffect(() => {
    if (!currentRelevanceBatch) { // not a batch
        return
    }

    const relDocs = currentRelevanceBatch[currentBatchIndex + 1] // NOTE: +1 since index starts from 0
    let relCount = 0
    let totalAP = 0

    relDocs.map((i) => {
        const idx = currentQueryResult[0].findIndex(doc => doc.document_id == i)
        relCount += 1

        totalAP += relCount / (idx + 1)
    })

    setCurrentMAP(totalAP / relCount)

    }, [currentQueryResult])
      

    return (
        <section className="flex items-center justify-center flex-col w-full mt-8 gap-4 overflow-x-hidden">
                <section className="w-full flex gap-6 py-2">
                  <Input disabled={searchDisabled} className="rounded-xs" placeholder="Search Document" onChange={(e) => setCurrentSearchPrompt(e.target.value)}/>
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
                      <DownloadButton />
                      <span className="px-4 py-2 text-gray-400 font-semibold rounded-xs text-center">
                        MAP: {currentMAP.toFixed(4)}
                      </span> 
                    </div>
                  </div>

                  <QuerySettings data={currentExpansion}/>
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
                            const relevantDoc = currentDocuments.filter(doc => doc.id == r.document_id)

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
    )
}