"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Video, Briefcase, Users, Globe, Heart, HandMetal, Lightbulb  } from "lucide-react"
import HomePage from "@/app/home/page";
import IntroPage from "./intro/page"
import { useRouter } from "next/navigation"
import Logo from "../../public/gnec_logo.png"
import Image from "next/image"


export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen space-y-4">
      <main className="flex-1">
        <HomePage />
        <IntroPage />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-100 to-teal-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sign Language Translator</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered tool translates sign language in real-time during interviews
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl border-2 border-teal-200 rounded-xl overflow-hidden bg-white">
              <div className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Sign language video feed would appear here</p>
                    <p className="text-xs text-gray-400 mt-2">Camera access required for live translation</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-medium text-sm text-gray-700 mb-1">Translation:</p>
                  <p className="text-gray-900">
                    "Hello, I'm excited about this opportunity and would like to discuss my qualifications."
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-teal-600 hover:bg-teal-700">Start Translation Demo</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">UN Sustainable Development Goals</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform supports these key UN goals to create a more equitable world
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="bg-red-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">Goal 8</Badge>
                    <CardTitle className="text-lg">Decent Work and Economic Growth</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500">
                    Promoting sustained, inclusive and sustainable economic growth, full and productive employment and
                    decent work for all.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-orange-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600">Goal 10</Badge>
                    <CardTitle className="text-lg">Reduced Inequalities</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500">
                    Reducing inequality within and among countries by promoting social, economic and political inclusion
                    of all.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="bg-green-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Goal 17</Badge>
                    <CardTitle className="text-lg">Partnerships for the Goals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500">
                    Strengthening the means of implementation and revitalizing the global partnership for sustainable
                    development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Find Your Next Opportunity?
                </h2>
                <p className="text-teal-50 md:text-xl/relaxed">
                  Join thousands of job seekers who have found inclusive employers through our platform.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-teal-600 hover:bg-teal-50 cursor-pointer" onClick={() => router.push("https://ace-mammoth-27.accounts.dev/sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F")}>Create Your Profile</Button>
                  <Button variant="outline" className="text-white border-white bg-teal-700 cursor-pointer">
                    Browse Jobs
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-500 p-6 rounded-lg">
                  <Users className="h-8 w-8 mb-2" />
                  <h3 className="text-xl font-bold">5,000+</h3>
                  <p className="text-teal-50">Candidates Placed</p>
                </div>
                <div className="bg-teal-500 p-6 rounded-lg">
                  <Briefcase className="h-8 w-8 mb-2" />
                  <h3 className="text-xl font-bold">1,200+</h3>
                  <p className="text-teal-50">Inclusive Employers</p>
                </div>
                <div className="bg-teal-500 p-6 rounded-lg">
                  <Heart className="h-8 w-8 mb-2" />
                  <h3 className="text-xl font-bold">98%</h3>
                  <p className="text-teal-50">Satisfaction Rate</p>
                </div>
                <div className="bg-teal-500 p-6 rounded-lg">
                  <Lightbulb className="h-8 w-8 mb-2" />
                  <h3 className="text-xl font-bold">24/7</h3>
                  <p className="text-teal-50">Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <Tabs defaultValue="job-seekers" className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Simple steps to get started with our platform
                  </p>
                </div>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="job-seekers" className="cursor-pointer">For Job Seekers</TabsTrigger>
                  <TabsTrigger value="employers" className="cursor-pointer">For Employers</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="job-seekers" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                        1
                      </div>
                      <CardTitle>Create Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Sign up and build your accessible profile highlighting your skills and accessibility needs.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                        2
                      </div>
                      <CardTitle>Find Matching Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Browse jobs that match your skills and offer the accommodations you need.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                        3
                      </div>
                      <CardTitle>Interview with Confidence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Use our sign language translation tools during interviews to communicate effectively.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mt-6">
                  <Button className="bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => router.push("https://ace-mammoth-27.accounts.dev/sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F")}>Sign Up as Job Seeker</Button>
                </div>
              </TabsContent>
              <TabsContent value="employers" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                        1
                      </div>
                      <CardTitle>Create Company Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Showcase your company's commitment to diversity and inclusion.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                        2
                      </div>
                      <CardTitle>Post Accessible Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Create job listings with clear information about workplace accessibility.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                        3
                      </div>
                      <CardTitle>Conduct Inclusive Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Use our platform's tools to ensure interviews are accessible for all candidates.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mt-6">
                  <Button className="bg-teal-600 hover:bg-teal-700 cursor-pointer" onClick={() => router.push("https://ace-mammoth-27.accounts.dev/sign-up?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F")}>Register as Employer</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Search Jobs</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find opportunities that match your skills and accessibility needs
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      className="w-full rounded-md border border-gray-200 pl-8 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <select className="w-full rounded-md border border-gray-200 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    <option value="">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">Search</Button>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Accessibility Specialist</CardTitle>
                        <CardDescription>TechForAll Inc. • Remote</CardDescription>
                      </div>
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Full-time</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Help our team build more accessible digital products. Experience with WCAG guidelines required.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Accessibility</Badge>
                      <Badge variant="outline">Remote</Badge>
                      <Badge variant="outline">Tech</Badge>
                      <Badge variant="outline">Sign Language Friendly</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-gray-500">Posted 2 days ago</p>
                    <Button variant="outline">View Details</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Customer Support Representative</CardTitle>
                        <CardDescription>Inclusive Solutions • Chicago, IL (Hybrid)</CardDescription>
                      </div>
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Part-time</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Join our diverse customer support team. Flexible hours and accessible workplace provided.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Customer Service</Badge>
                      <Badge variant="outline">Hybrid</Badge>
                      <Badge variant="outline">Wheelchair Accessible</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-gray-500">Posted 5 days ago</p>
                    <Button variant="outline">View Details</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Software Developer</CardTitle>
                        <CardDescription>EqualTech • San Francisco, CA</CardDescription>
                      </div>
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Full-time</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Develop accessible web applications. We provide all necessary accommodations for team members.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Software Development</Badge>
                      <Badge variant="outline">On-site</Badge>
                      <Badge variant="outline">Fully Accessible Office</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-gray-500">Posted 1 week ago</p>
                    <Button variant="outline">View Details</Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="flex justify-center mt-8">
                <Button variant="outline">View All Jobs</Button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Sign Language Tools
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Accessibility Features
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">UN Goals</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Goal 8: Decent Work
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Goal 10: Reduced Inequalities
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Goal 17: Partnerships
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Our Impact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Employer Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Accessibility Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t pt-6">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Sign1o. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
