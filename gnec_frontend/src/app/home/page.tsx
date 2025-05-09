"use client"
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import background from "../../../public/background.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
  return (
    <section className="w-full relative -mt-15 mb-50">
      <div className="w-full h-[40vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh] relative mb-20">
        <Image
          src={background}
          alt="Diverse group of people in an interview setting"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="relative -mt-50 sm:-mt-120 md:-mt-130 lg:-mt-140 xl:-mt-160">
          <div className="bg-white rounded-lg p-1 xs:p-7 sm:p-7 md:p-8 lg:p-10 max-w-3xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-xs text-black">
                Inclusive Opportunities
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold tracking-tighter">
                Breaking Barriers in the Interview Process
              </h1>
              <p className="text-gray-500 text-sm sm:text-base md:text-lg lg:text-lg max-w-2xl mx-auto">
                Our platform translates sign language, connects minorities with inclusive employers, and promotes the
                UN Sustainable Development Goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button className="bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => router.push("/jobs")}>
                  Find Jobs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button className="cursor-pointer" variant="outline" onClick={() => router.push("/sign-language")}>Try Sign Language Translator</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
