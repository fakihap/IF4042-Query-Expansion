"use client";

import { WeightingSchemes, groupedWeightingSchemes, useQuerySettingsStore } from "@/store/querySettingsStore";
import type { WeightingScheme } from "@/store/querySettingsStore";

import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { BrushCleaning, FlaskConical, SquareSlash, ScissorsLineDashed, Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 


function WeightSchemeCombobox() {
    const [open, setOpen] = useState(false)
    const {
        weightingScheme,
        setWeightingScheme,
    } = useQuerySettingsStore()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between cursor-pointer ml-6"
                >
                {weightingScheme
                    ? Object.values(WeightingSchemes).find((scheme) => scheme === weightingScheme)
                    : "Select framework..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[16rem] p-0">
                <Command>
                    <CommandList className="max-h-none">
                        {
                            Object.values(groupedWeightingSchemes).map(({group, items}) => (
                                <CommandGroup key={group} heading={group}>
                                {items.map((item) => (
                                    <CommandItem
                                    key={item}
                                    value={item}
                                    onSelect={(newWeightingScheme) => {
                                        setWeightingScheme(newWeightingScheme as WeightingScheme)
                                        setOpen(false)
                                    }}
                                    >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        weightingScheme === item ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item}
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            ))
                        }
                        
                    </CommandList>
                </Command>
            </PopoverContent>
            </Popover>
    )
}

export default function QuerySettings() {
    const {
        useStemming,
        useStopWordElim,
        setUseStemming,
        setStopWordElim,
    } = useQuerySettingsStore()

    return (
        <section className="flex flex-col gap-4 justify-center">
            <h2 className="text-2xl font-bold pb-4">Query Settings</h2>
            <div className="flex items-center justify-between w-full">
                <Label className="font-medium" htmlFor="use-stemming">
                    <ScissorsLineDashed />
                    Stemming
                </Label>
                <Switch className="cursor-pointer" id="use-stemming" checked={useStemming} onCheckedChange={(e) => setUseStemming(e)} />
            </div>
            <div className="flex items-center justify-between w-full">
                <Label className="font-medium" htmlFor="use-stopwordelim">
                    <SquareSlash />
                    Stop-Word Elimination
                </Label>
                <Switch className="cursor-pointer" id="use-stopwordelim" checked={useStopWordElim} onCheckedChange={(e) => setStopWordElim(e)}/>
            </div>
            <div className="flex flex-col gap-4">
                <Label className="font-medium">
                    <FlaskConical />
                    Weighting Scheme
                </Label>
                <WeightSchemeCombobox />
            </div>
            
        </section>
    )
}