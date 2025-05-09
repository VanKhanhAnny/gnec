import { Dancing_Script } from "next/font/google"
import gnecLogo from "../../../public/gnec_logo.png";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const dancing = Dancing_Script({
    subsets: ["latin"],
    weight: "700",
})
export default function logo() {
  return (
      <Link href="/" className={cn("flex gap-2 items-center",
          `${dancing.className} text-3xl`)}>
          <Image className="lg:size-18 md:size-15 size-12 [filter:drop-shadow(2px_2px_4px_rgba(255,255,255,2))]" src={gnecLogo} alt="logo" />
          <div className="hidden text-3xl lg:block [text-shadow:2px_2px_4px_rgba(255,255,255,2)]">Sign1o</div>
      </Link>
  )
}
