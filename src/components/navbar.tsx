import { SunIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function NavbarComponent(props: { title?: string }) {
  return (
    <>
      <div className="h-16 w-full border-b fixed top-0 bg-background z-20 left-0 right-0">
        {/* container */}
        <div className="flex items-center justify-between h-16 max-w-[512px] px-4 mx-auto">
          <Button variant={"link"} className="px-0 font-semibold text-base">
            {props.title ?? "Unitip"}
          </Button>

          {/* profile icon */}
          <div className="flex items-center gap-2">
            <Button size={"icon"} variant={"outline"}>
              <SunIcon />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </>
  );
}
