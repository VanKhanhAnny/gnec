"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Mic, Volume2, HandMetal } from "lucide-react"
import { useRouter } from "next/navigation"
import Logo from "../../../public/gnec_logo.png"
import Image from "next/image"
import ASLRecognition from "@/components/ASLRecognition"

export default function SignLanguagePage() {
  const router = useRouter();
  const [translation, setTranslation] = useState<string>("");
  
  const handleTranslationUpdate = (newTranslation: string) => {
    setTranslation(newTranslation);
  };
  
  return (
    <div className="flex flex-col min-h-screen text-center items-center">
      <main className="flex-1">
        <section className="w-full py-12 md:py-12 lg:py-32 px-12 md:px-24 sm:px-24 lg:px-48 bg-gradient-to-b from-teal-600 to-white -mt-15">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Sign Language Translation</h1>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered tool translates sign language in real-time, making communication seamless during
                  interviews
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 sm:py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <Tabs defaultValue="translate" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                <TabsTrigger value="translate" className="cursor-pointer">Sign to Text</TabsTrigger>
                <TabsTrigger value="learn" className="cursor-pointer">Learn Sign Language</TabsTrigger>
              </TabsList>
              <TabsContent value="translate" className="mt-6">
                <Card className="border-2 border-teal-100">
                  <CardHeader>
                    <CardTitle>Real-time Sign Language Translation</CardTitle>
                    <CardDescription>
                      Use your camera to translate sign language into text during interviews or conversations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <ASLRecognition onTranslationUpdate={handleTranslationUpdate} />
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 h-full min-h-[200px]">
                          <p className="font-medium text-sm text-gray-700 mb-2">Full Translation:</p>
                          <div className="space-y-2">
                            {translation ? (
                              <p className="text-gray-900">{translation}</p>
                            ) : (
                              <>
                                <p className="text-gray-500 italic">Start signing to see translation here</p>
                                <p className="text-gray-900 hidden">"Hello, my name is [Name]."</p>
                                <p className="text-gray-900 hidden">"I am interested in the position."</p>
                                <p className="text-gray-900 hidden">"I have experience in this field."</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="bg-teal-50 p-4 rounded-lg w-full">
                      <h3 className="font-medium text-sm mb-2">Tips for best results:</h3>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                        <li>Ensure good lighting on your hands and face</li>
                        <li>Position yourself so your upper body is clearly visible</li>
                        <li>Make signs at a moderate pace for better recognition</li>
                        <li>Use a plain background if possible</li>
                      </ul>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <p className="text-sm text-gray-500">
                        Your privacy is important. Video is processed locally and not stored.
                      </p>
                      <Button variant="outline" size="sm">
                        Settings
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="learn" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learn Basic Sign Language</CardTitle>
                    <CardDescription>
                      Master essential signs to improve communication with the deaf and hard of hearing community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Greetings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                            <p className="text-gray-500">Sign animation</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Learn how to say "Hello," "Thank you," "Please," and other common greetings.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost" className="w-full">
                            Start Lesson
                          </Button>
                        </CardFooter>
                      </Card>
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Job Interview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                            <p className="text-gray-500">Sign animation</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Essential signs for job interviews, including discussing skills and experience.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost" className="w-full">
                            Start Lesson
                          </Button>
                        </CardFooter>
                      </Card>
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Workplace</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                            <p className="text-gray-500">Sign animation</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            Common workplace terms and phrases to facilitate day-to-day communication.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="ghost" className="w-full">
                            Start Lesson
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button className="bg-teal-600 hover:bg-teal-700">View All Lessons</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">How Our Translation Works</h2>
                <p className="text-gray-500 md:text-lg/relaxed">
                  Our sign language translation technology uses advanced computer vision and machine learning to
                  recognize hand gestures, facial expressions, and body movements in real-time.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mt-0.5">
                      1
                    </div>
                    <p className="text-gray-600">Camera captures your signing movements</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mt-0.5">
                      2
                    </div>
                    <p className="text-gray-600">AI model recognizes and interprets the signs</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mt-0.5">
                      3
                    </div>
                    <p className="text-gray-600">Text is generated in real-time</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mt-0.5">
                      4
                    </div>
                    <p className="text-gray-600">Optional: Text-to-speech for verbal output</p>
                  </li>
                </ul>
                <div className="flex gap-4">
                  <Button className="bg-teal-600 hover:bg-teal-700">Try It Now</Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <Mic className="h-8 w-8 text-teal-600 mb-2" />
                      <CardTitle className="text-lg">Speech to Sign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Converts spoken language to sign language animations for deaf and hard of hearing users.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <HandMetal className="h-8 w-8 text-teal-600 mb-2" />
                      <CardTitle className="text-lg">Sign to Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Translates sign language to written text for seamless communication.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <Volume2 className="h-8 w-8 text-teal-600 mb-2" />
                      <CardTitle className="text-lg">Text to Speech</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Converts translated text to spoken words for hearing individuals.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <Video className="h-8 w-8 text-teal-600 mb-2" />
                      <CardTitle className="text-lg">Video Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Integrates with video conferencing tools for accessible remote interviews.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Success Stories</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  How our sign language translation has helped bridge communication gaps
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Sarah's Story</CardTitle>
                  <CardDescription>Software Developer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    "As a deaf software developer, I struggled with job interviews. Sign1o's sign language
                    translation tool allowed me to communicate effectively with potential employers. I'm now working at
                    my dream company!"
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>TechCorp's Experience</CardTitle>
                  <CardDescription>Employer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    "We've been able to hire talented individuals from the deaf community thanks to this platform. The
                    sign language translation has removed communication barriers during interviews and in the
                    workplace."
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Michael's Journey</CardTitle>
                  <CardDescription>Marketing Specialist</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    "I used to rely on interpreters for job interviews, which was often complicated to arrange. With
                    this platform, I can interview independently and showcase my skills without logistical barriers."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-teal-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Ready to Break Communication Barriers?</h2>
                <p className="text-teal-50 md:text-xl/relaxed">
                  Join thousands of users who are making interviews and workplaces more accessible with our sign
                  language translation tools.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-teal-600 hover:bg-teal-50 cursor-pointer" onClick={() => router.push("/sign-language")}>Try Translation Now</Button>
                  <Button variant="outline" className="text-white border-white bg-teal-700 cursor-pointer">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="bg-teal-500 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Sign Language Translation Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Real-time translation during interviews</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Works with American Sign Language (ASL) and other sign languages</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Integrates with video conferencing platforms</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>No specialized equipment needed - just a webcam</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-white text-teal-600 flex items-center justify-center mt-0.5">
                      ✓
                    </div>
                    <p>Privacy-focused - processing happens locally</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50 w-full">
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
