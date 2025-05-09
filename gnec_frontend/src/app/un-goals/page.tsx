import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, Briefcase, BarChart3, CheckCircle } from "lucide-react"
import Logo from "../../../public/gnec_logo.png"
import Image from "next/image"

export default function UNGoalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">UN Sustainable Development Goals</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  How our platform contributes to the United Nations' vision for a better and more sustainable future
                  for all
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-800">
                  Our Commitment
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">Supporting Global Goals</h2>
                <p className="text-gray-500 md:text-lg/relaxed">
                  At Sign1o, we're committed to supporting the UN Sustainable Development Goals (SDGs) through
                  our platform. We focus particularly on goals related to reducing inequalities, promoting decent work,
                  and fostering partnerships.
                </p>
                <p className="text-gray-500 md:text-lg/relaxed">
                  By creating technology that helps people with disabilities find meaningful employment, we're
                  contributing to a more inclusive and equitable world.
                </p>
                <div className="flex gap-4">
                  <Button className="bg-teal-600 hover:bg-teal-700">Learn More</Button>
                  <Button variant="outline">Our Impact</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Key UN Goals We Support</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform directly contributes to these important Sustainable Development Goals
                </p>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-2 border-red-100">
                <CardHeader className="bg-red-50 rounded-t-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-600">Goal 8</Badge>
                  </div>
                  <CardTitle>Decent Work and Economic Growth</CardTitle>
                  <CardDescription>
                    Promote sustained, inclusive and sustainable economic growth, full and productive employment and
                    decent work for all
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">How we contribute:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Creating job opportunities for people with disabilities</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Promoting inclusive hiring practices</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Removing communication barriers in the workplace</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-orange-100">
                <CardHeader className="bg-orange-50 rounded-t-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-600">Goal 10</Badge>
                  </div>
                  <CardTitle>Reduced Inequalities</CardTitle>
                  <CardDescription>
                    Reduce inequality within and among countries by promoting social, economic and political inclusion
                    of all
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">How we contribute:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Breaking down barriers for marginalized communities</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Creating equal access to employment opportunities</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Developing accessible technology for all</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
              <Card className="border-2 border-green-100">
                <CardHeader className="bg-green-50 rounded-t-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600">Goal 17</Badge>
                  </div>
                  <CardTitle>Partnerships for the Goals</CardTitle>
                  <CardDescription>
                    Strengthen the means of implementation and revitalize the global partnership for sustainable
                    development
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">How we contribute:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Collaborating with disability advocacy organizations</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Partnering with inclusive employers worldwide</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600">Sharing technology and knowledge to advance inclusion</p>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Our Impact</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Measuring our contribution to the UN Sustainable Development Goals
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <Briefcase className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle className="text-4xl font-bold">5,000+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">People with disabilities placed in meaningful employment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Users className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle className="text-4xl font-bold">1,200+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Employers committed to inclusive hiring practices</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Globe className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle className="text-4xl font-bold">35</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Countries where our platform is making a difference</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <BarChart3 className="h-8 w-8 text-teal-600 mb-2" />
                  <CardTitle className="text-4xl font-bold">45%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Average increase in workplace diversity for partner companies</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-teal-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Join Our Mission</h2>
                <p className="text-teal-50 md:text-xl/relaxed">
                  Help us create a more inclusive world by supporting our platform and the UN Sustainable Development
                  Goals.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-teal-600 hover:bg-teal-50 cursor-pointer">Partner With Us</Button>
                  <Button variant="outline" className="text-white border-white bg-teal-700 cursor-pointer">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="bg-teal-500 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Ways to Get Involved</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Become an inclusive employer partner</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Sponsor accessibility features on our platform</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Share success stories and best practices</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Advocate for inclusive hiring in your organization</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Contribute to our technology development</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold">Sign1o</span>
            </div>
            <p className="text-sm text-gray-500 md:ml-auto">
              Breaking barriers in employment for people with disabilities
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Sign1o. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
