"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function QuerySettings() {
    return (
        <div className="w-full">
            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs w-full pb-3">
                <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                <span className="sr-only">Previous</span>
                <ArrowLeft aria-hidden="true" className="size-5" />
                </a>
                <a
                href="#"
                aria-current="page"
                className="relative z-10 w-full inline-flex items-center justify-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-center"
                >
                Query
                </a>
                <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                <span className="sr-only">Next</span>
                <ArrowRight aria-hidden="true" className="size-5" />
                </a>
            </nav>
            <div className="flex items-center justify-between">
                <div className="flex items-center bg-white rounded-full px-4 py-2 w-7/10 overflow-hidden">
                    <span className="text-black font-medium whitespace-nowrap">Suggested</span>
                    <div className="ml-4 flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex-nowrap">
                        <div className="inline-flex gap-2 flex-nowrap w-1">
                            <span className="bg-gray-200 text-black px-4 py-1 rounded-md">Word 1</span>
                            <span className="bg-gray-200 text-black px-4 py-1 rounded-md">Word 1</span>
                            <span className="bg-gray-200 text-black px-4 py-1 rounded-md">Word 1</span>
                            <span className="bg-gray-200 text-black px-4 py-1 rounded-md">Word 1</span>
                            <span className="bg-gray-200 text-black px-4 py-1 rounded-md">Word 1</span>
                        </div>
                    </div>
                </div>
                <Button variant={"outline"}  className="px-4 py-2 hover:cursor-pointer rounded-xs" disabled>
                    Average Precision: 99.99
                </Button> 
            </div>
        </div>
)
}