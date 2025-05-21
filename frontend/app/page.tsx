"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import QuerySettings from "./components/query-settings";
import QueryHistory from "./components/query-history";

export default function Home() {

  return (
    <div className="grid grid-cols-[20rem_1fr] h-screen">
      {/* sidebar */}
      <aside className="w-full h-screen bg-sidebar px-8 py-12 flex flex-col gap-8">
        <QuerySettings />
        <Separator />
        <QueryHistory />
      </aside>

      {/* main - container */}
      <main className="h-full bg-sidebar overflow-y-scroll">
        {/* main - content */}
        <section className="h-full w-full bg-background mt-8 rounded-xl grid grid-cols-[20rem_1fr_20rem] ">
          <div>QGAN</div>
          <section className="flex items-center justify-center flex-col w-full mt-8 gap-4">

            {/* query */}
            <Card className="bg-card w-full h-[4rem] ">ad</Card>
            {/* query */}
            <Card className="bg-card w-full h-[4rem]">ad</Card>
            {/* query */}
            <Card className="bg-card w-full h-[4rem]">ad</Card>
          </section>
         

        </section>
      </main>
    </div>
  );
}
