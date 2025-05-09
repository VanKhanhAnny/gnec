"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Globe, Video } from "lucide-react"
import { useRouter } from "next/navigation"
export default function IntroPage() {
    const router = useRouter();
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tools designed to create equal opportunities for everyone in the job market
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-10 lg:grid-cols-3">
              <Card className="border-2 border-teal-100">
                <CardHeader className="pb-2">
                  <Video className="h-12 w-12 text-teal-600 mb-2" />
                  <CardTitle className="text-[22px]">Sign Language Translation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Real-time sign language translation during video interviews, making communication seamless for
                    everyone.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full cursor-pointer" onClick={() => router.push("/sign-language")}>
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-teal-100">
                <CardHeader className="pb-2">
                  <Briefcase className="h-12 w-12 text-teal-600 mb-2" />
                  <CardTitle className="text-[22px]">Inclusive Job Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Smart algorithms that match candidates with disability-friendly employers and accessible workplaces.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full cursor-pointer" onClick={() => router.push("/jobs")}>
                    Find Jobs
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-teal-100">
                <CardHeader className="pb-2">
                  <Globe className="h-12 w-12 text-teal-600 mb-2" />
                  <CardTitle className="text-[22px]">UN Goals Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Supporting UN Sustainable Development Goals, particularly focused on reducing inequalities.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full cursor-pointer" onClick={() => router.push("/un-goals")}>
                    Explore Goals
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
  )
}
