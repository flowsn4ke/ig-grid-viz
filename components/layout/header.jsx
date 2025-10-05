import { BrushCleaning, Cog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="mt-10 flex flex-col gap-y-1 w-full mb-5">
      <div className="w-full flex justify-around">
        <div className="h-30 w-30">
          <Avatar className="h-full w-full">
            <AvatarImage src="ig-icon.webp" />
            <AvatarFallback>IGG</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex  gap-x-4">
            <h1 className="text-2xl">instagrid</h1>
            <Button variant="outline">
              <Cog />
              <span>Edit</span>
            </Button>
            <Button variant="outline">
              <BrushCleaning />
              <span>Clear All</span>
            </Button>
          </div>
          <div className="flex">
            <h2 className="opacity-80 text-center text-sm tracking-tight">
              Design an engaging Instagram grid now !
            </h2>
          </div>
          <div className="flex">
            <p className="flex items-center gap-x-2 opacity-80 text-center text-sm tracking-tight">
              <span>Drop images anywhere to get started</span>✨
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
