"use client";

import { ArrowUp, Heart } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="h-42 flex items-center justify-between w-full px-8">
      <ThemeToggle />
      <Button
        variant="outline"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp />
        Back to top
      </Button>
      <p className="flex">
        Made with&nbsp;
        <Heart className="fill-red-500 text-red-500" />
        &nbsp;@
        <a
          href="https://siquemlabs.com"
          className="underline underline-offset-4"
          target="_blank"
        >
          SiquemLabs
        </a>
      </p>
    </footer>
  );
}
