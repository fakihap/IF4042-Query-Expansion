
import { useMainStore } from "@/store/mainStore"
import { Button } from "@/components/ui/button"

export default function DownloadButton() {
    const {
        currentQueryResult
    } = useMainStore()

    const saveToFile = (filename: string, content: string) => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <Button disabled={currentQueryResult.length == 0} variant={"secondary"} className="px-8 py-2 hover:cursor-pointer rounded-xs"
            onClick={() => saveToFile("results.json", JSON.stringify(currentQueryResult[0], null, 2))}
        >
            Download Results
        </Button> 
    )
}