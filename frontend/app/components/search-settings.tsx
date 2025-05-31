"use client";

import { WeightingSchemes, useQuerySettingsStore } from "@/store/querySettingsStore";
import type { WeightingScheme } from "@/store/querySettingsStore";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FlaskConical, SquareSlash, ScissorsLineDashed, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
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
            <PopoverContent className="w-[200px] p-0">
                <Command>
                <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                    {Object.values(WeightingSchemes).map((scheme) => (
                        <CommandItem
                        key={scheme}
                        value={scheme}
                        onSelect={(newWeightingScheme) => {
                            setWeightingScheme(newWeightingScheme as WeightingScheme)
                            setOpen(false)
                        }}
                        >
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4",
                            weightingScheme === scheme ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {scheme}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
            </Popover>
    )
}

export default function SearchSettings() {
    const {
        useStemming,
        useStopWordElim,
        useIDF, 
        useNormalization,
        numberExpansionWords,
        setUseStemming,
        setStopWordElim,
        setUseIDF,
        setUseNormalization,
        setNumberExpansionWords
    } = useQuerySettingsStore()

    return (
        <section className="flex flex-col gap-4 justify-center">
            <h2 className="text-2xl font-bold pb-4">Search Settings</h2>

            <h4 className="text-l font-bold">Vocabulary</h4>
            <div className="flex items-center justify-between w-full">
                <Label className="font-light" htmlFor="use-stemming">
                    <ScissorsLineDashed />
                    Stemming
                </Label>
                <Switch className="cursor-pointer" id="use-stemming" checked={useStemming} onCheckedChange={(e) => setUseStemming(e)} />
            </div>
            <div className="flex items-center justify-between w-full">
                <Label className="font-light" htmlFor="use-stopwordelim">
                    <SquareSlash />
                    Stop-Word Elimination
                </Label>
                <Switch className="cursor-pointer" id="use-stopwordelim" checked={useStopWordElim} onCheckedChange={(e) => setStopWordElim(e)}/>
            </div>

            <h4 className="text-l font-bold">Term Weighting</h4>
            <div className="flex flex-col gap-4">
                <Label className="font-light">
                    <FlaskConical />
                    Term 
                </Label>
                <WeightSchemeCombobox />
            </div>
            <div className="flex items-center justify-between w-full">
                <Label className="font-light" htmlFor="use-stopwordelim">
                    <SquareSlash />
                    Inverse Document 
                </Label>
                <Switch className="cursor-pointer" id="use-stopwordelim" checked={useIDF} onCheckedChange={(e) => setUseIDF(e)}/>
            </div>

            <h4 className="text-l font-bold">Similarity Calculation</h4>
            <div className="flex items-center justify-between w-full">
                <Label className="font-light" htmlFor="use-stopwordelim">
                    <SquareSlash />
                    Normalization
                </Label>
                <Switch className="cursor-pointer" id="use-stopwordelim" checked={useNormalization} onCheckedChange={(e) => setUseNormalization(e)}/>
            </div>
            
            <h4 className="text-l font-bold">Word Expansion</h4>
            <div className="flex items-center justify-between ">
                <Label className="font-light" htmlFor="use-stopwordelim">
                    <SquareSlash />
                    Number Words
                </Label>
                <div className="flex items-center justify-between w-1/2">
                    <Input type="number" className="w-1/2 text-center" value={numberExpansionWords == -1 ? "" : numberExpansionWords} onChange={(e) => setNumberExpansionWords(parseInt(e.target.value))} disabled={numberExpansionWords === -1}/>
                    <Switch className="cursor-pointer" id="use-stopwordelim" checked={numberExpansionWords == -1} onCheckedChange={(e) => numberExpansionWords == -1 ? setNumberExpansionWords(4) : setNumberExpansionWords(-1)}/>
                    <Label className="font-medium" htmlFor="use-stopwordelim">
                        All
                    </Label>
                </div>
            </div>
        </section>
    )
}