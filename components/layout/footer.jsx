import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="h-42 flex items-center justify-center">
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
    </footer>
  );
}
