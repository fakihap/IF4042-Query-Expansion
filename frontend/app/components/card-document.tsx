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

export default function CardDocument() {
    return (
        <Card className="mb-2">
            <CardHeader>
                <div className="flex justify-between items-center w-full">
                    <div className="w-9/10">
                        <CardTitle>Lorem ipsum dolor sit amet, consectetur adipiscing elit</CardTitle>
                        <CardDescription>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque ...</CardDescription>
                    </div>
                    <div className="flex flex-col w-1/10 items-center">
                        <h6 className="text-xs">Similarity</h6>
                        <h2 className="text-2xl font-bold">99.99</h2>
                    </div>
                </div>
            </CardHeader>
        </Card>
)
}