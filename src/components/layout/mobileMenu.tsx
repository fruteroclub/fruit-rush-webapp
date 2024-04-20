"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";

type MobileMenuProps = {
  authenticated: boolean;
  login: () => void;
  logout: () => void;
  // menuItems?: [{ displayText: string; href: string }];
};

export default function MobileMenu({
  authenticated,
  login,
  logout,
}: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger>
        <Menu size={28} />
      </SheetTrigger>
      <SheetContent className="border-l-0 bg-background">
        <SheetHeader className="mb-4 text-left">
          <SheetTitle>menú</SheetTitle>
        </SheetHeader>
        <div className={`flex flex-col space-y-4`}>
          <Button
            variant={authenticated ? "outline" : "default"}
            size="sm"
            className={`text-md`}
            onClick={authenticated ? handleLogout : login}
          >
            {authenticated ? "Logout" : "Deploy"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
