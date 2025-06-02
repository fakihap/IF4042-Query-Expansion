"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { searchInvertedFile } from "../actions";
import { useQuerySettingsStore } from "@/store/querySettingsStore";

export default function InvertedViewer() {
    const [docId, setDocId] = useState("");
    const [currentDoc, setCurrentDoc] = useState({"id": -1, "title": "", "author": "", "abstract": "", "tf":[], "idf":[]});
    const {
        useStemming,
        useStopWordElim,
        weightingScheme,
        useIDF,
        useNormalization,
      } = useQuerySettingsStore()

    const handleSearch = async () => {
      if (docId) {
          const res = await searchInvertedFile({
                document_id: parseInt(docId),
                useStemming: useStemming,
                useStopwordElim: useStopWordElim,
                tfMode: "augmented",
                useIDF: useIDF, 
                useNormalize: useNormalization,
              })
          
          console.log(res)
          if (res.result.id != -1) {
              setCurrentDoc({"id": -1, "title": "", "author": "", "abstract": "", "tf":[], "idf":[]});
          } else {
              setCurrentDoc({"id": -1, "title": "", "author": "", "abstract": "", "tf":[], "idf":[]})
          }
      }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold pb-2 mt-4">Browse Inverted File</h2>
              <section className="w-full flex gap-6 py-2">
                <Input type="number" className="rounded-xs" value={docId} onChange={(e) => setDocId(e.target.value)} placeholder="Search Document ID" />
                <Button onClick={handleSearch} variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs">
                    <Search />
                    Search
                </Button> 
              </section>

              <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mt-4 overflow-hidden">
                <span className="text-black font-medium whitespace-nowrap text-xs">Document ID: {currentDoc.id === -1 ? "NOT FOUND" : currentDoc.id}</span>
              </div>
              <h2 className="text-2xl mt-2 font-bold">{currentDoc.id === -1
                                                            ? "NOT FOUND"
                                                            : currentDoc.title.length > 40
                                                                ? currentDoc.title.slice(0, 40) + "..."
                                                                : currentDoc.title}</h2>
              <h2 className="text-l italic">Author: {currentDoc.id === -1 ? "NOT FOUND" : currentDoc.author}</h2>
              <h2 className="text-l text-gray-500 mb-2">{currentDoc.id === -1
                                                            ? "NOT FOUND"
                                                            : currentDoc.abstract.length > 100
                                                                ? currentDoc.abstract.slice(0, 100) + "..."
                                                                : currentDoc.abstract}</h2>

              <Tabs defaultValue="abstract" asChild>
                <div>
                  <div className="flex w-full justify-end">
                    <section className="w-2/3 flex py-2 gap-2 justify-end">
                      <TabsList>
                        <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="title">Title</TabsTrigger>
                        <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="author">Author</TabsTrigger>
                        <TabsTrigger className="px-4 cursor-pointer hover:bg-accent" value="abstract">Abstract</TabsTrigger>
                      </TabsList>
                      <div className="flex 1/2">
                        <Button variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs">
                          <Search />
                        </Button> 
                        <Input className="rounded-xs" placeholder="Search Vocabulary" />
                      </div>
                    </section>
                  </div>

                  <TabsContent value="title">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Word</TableHead>
                          <TableHead className="text-center">TF</TableHead>
                          <TableHead className="text-center">IDF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-center">word</TableCell>
                            <TableCell className="text-center">250.00</TableCell>
                            <TableCell className="text-center">250.00</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-center">
                      <Pagination>
                      <PaginationContent>
                          <PaginationItem>
                          <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationNext href="#" />
                          </PaginationItem>
                      </PaginationContent>
                      </Pagination>
                    </div>
                  </TabsContent>

                  <TabsContent value="author">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Word</TableHead>
                          <TableHead className="text-center">TF</TableHead>
                          <TableHead className="text-center">IDF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-center">word</TableCell>
                            <TableCell className="text-center">50.00</TableCell>
                            <TableCell className="text-center">50.00</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-center">
                      <Pagination>
                      <PaginationContent>
                          <PaginationItem>
                          <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationNext href="#" />
                          </PaginationItem>
                      </PaginationContent>
                      </Pagination>
                    </div>
                  </TabsContent>

                  <TabsContent value="abstract">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Word</TableHead>
                          <TableHead className="text-center">TF</TableHead>
                          <TableHead className="text-center">IDF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-center">word</TableCell>
                            <TableCell className="text-center">20.00</TableCell>
                            <TableCell className="text-center">20.00</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-center">
                      <Pagination>
                      <PaginationContent>
                          <PaginationItem>
                          <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                          <PaginationNext href="#" />
                          </PaginationItem>
                      </PaginationContent>
                      </Pagination>
                    </div>
                  </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}