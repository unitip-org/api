import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function NavbarComponent() {
  return (
    <>
      <div className="h-16 w-full flex items-center px-4 border-b justify-between fixed top-0 bg-background max-w-[512px] z-20">
        <Button variant={"link"} className="px-0 font-semibold text-base">
          Unitip
        </Button>

        {/* profile icon */}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </>
  );
}
