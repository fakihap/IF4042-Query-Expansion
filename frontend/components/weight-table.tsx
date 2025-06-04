'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PageButtons from "./pagination";
import { useState } from "react";

interface WeightTableProps {
  data: number[][]; // [TF[], IDF[]]
  vocab: string[];
}

const WeightTable = ({ data, vocab }: WeightTableProps) => {
    const [currentPage, setCurrentPage] = useState<number[]>([]);
    
    return (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Word</TableHead>
                    <TableHead className="text-center">TF</TableHead>
                    <TableHead className="text-center">IDF</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {data && currentPage.map((idx) => (
                    <TableRow key={idx}>
                    <TableCell className="font-medium text-center">{vocab[idx]}</TableCell>
                    <TableCell className="text-center">{data[0][idx]}</TableCell>
                    <TableCell className="text-center">{data[1][idx]}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <div className="flex items-center justify-center">
                {
                 <PageButtons data={vocab} setCurrentItems={setCurrentPage}/>
                }
            </div>
        </>
    );
};

export default WeightTable;