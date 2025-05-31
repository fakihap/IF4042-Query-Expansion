"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CardDocumentProps = {
  title: string;
  abstract: string;
  similarity: number;
};

export default function CardDocument({ title, abstract, similarity }: CardDocumentProps) {
    return (
        <Card className="mb-2 w-full">
            <CardHeader>
                <div className="flex justify-between items-center w-full">
                    <div className="w-85/100">
                        <CardTitle className="pb-1">{title.length > 50
                                        ? title.slice(0, 50) + "..."
                                        : title}</CardTitle>
                        <CardDescription>{abstract.length > 125
                                        ? abstract.slice(0, 125) + "..."
                                        : abstract}</CardDescription>
                    </div>
                    <div className="flex flex-col w-1/10 items-center">
                        <h6 className="text-xs">Similarity</h6>
                        <h2 className="text-2xl font-bold">{similarity}</h2>
                    </div>
                </div>
            </CardHeader>
        </Card>
)
}