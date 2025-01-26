import { Loader2 } from "lucide-react"
import { cn } from "../lib/utils"

export const Loading = ({classes}:{classes?:string}) => {
  return (
    <div className={cn("flex flex-col text-3xl font-semibold text-muted-foreground w-screen h-screen justify-center items-center",classes)}>
        <Loader2 className="animate-spin size-16"/>
        Loading...
    </div>
  )
}
