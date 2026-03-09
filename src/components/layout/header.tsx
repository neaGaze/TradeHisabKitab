import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          TradeHisabKitab
        </Link>

        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}
