import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function NavbarComponent() {
  return (
    <>
      <div className="h-16 w-full border-b fixed top-0 bg-background z-20">
        {/* container */}
        <div className="flex items-center justify-between h-16 max-w-[512px] px-4 mx-auto">
          <Button variant={"link"} className="px-0 font-semibold text-base">
            Unitip
          </Button>

          {/* profile icon */}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
}
