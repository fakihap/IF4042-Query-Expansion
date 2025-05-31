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
import data from "./cisi.json"; 

export default function InvertedViewer() {
    const [docId, setDocId] = useState("");
    const docs = data
    const [currentDoc, setCurrentDoc] = useState({"id": -1, "title": "", "author": "", "abstract": ""});

    const handleSearch = () => {
    if (docId) {
        const foundDoc = data.find((doc) => doc.id === parseInt(docId));
        if (foundDoc) {
            setCurrentDoc(foundDoc);
        } else {
            setCurrentDoc({"id": -1, "title": "", "author": "", "abstract": ""})
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

              <div className="flex w-full justify-end">
                <section className="w-1/3 flex py-2">
                  <Button variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs">
                      <Search />
                  </Button> 
                  <Input className="rounded-xs" placeholder="Search Vocabulary" />
                </section>
              </div>

              <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-center">Word</TableHead>
                    <TableHead className="text-center">Weight</TableHead>
                    </TableRow>
                </TableHeader>
                {Array.from({ length: 10 }).map((_, i) => (
                <TableBody key={i}>
                    <TableRow>
                    <TableCell className="font-medium text-center">word</TableCell>
                    <TableCell className="text-center">250.00</TableCell>
                    </TableRow>
                </TableBody>
                ))}
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
        </div>
    )
}