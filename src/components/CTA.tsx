"use client"
import React from "react";
// import Link from "next/link";
import { ctaDetails } from "@/data/cta";

const CTA: React.FC = () => {
    return (
        <section id="join" className="mt-10 mb-5 lg:my-20">
            <div className="relative h-full w-full z-10 mx-auto py-12 sm:py-20">
                <div className="h-full w-full">
                    <div className="rounded-3xl opacity-95 absolute inset-0 -z-10 h-full w-full bg-[#050a14] bg-[linear-gradient(to_right,#0a111f_1px,transparent_1px),linear-gradient(to_bottom,#0a111f_1px,transparent_1px)] bg-[size:6rem_4rem]">
                        <div className="rounded-3xl absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_600px_at_50%_500px,#1e3a8a,transparent)]"></div>
                    </div>

                    <div className="h-full flex flex-col items-center justify-center text-white text-center px-5">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl md:leading-tight font-semibold mb-4 max-w-2xl">{ctaDetails.heading}</h2>

                        <p className="mx-auto max-w-xl md:px-5 mb-6">{ctaDetails.subheading}</p>

                        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <h3 className="text-xl font-medium mb-4">Sign Up for Updates</h3>
                            <form 
                                action="https://formspree.io/f/moveazyg" 
                                method="POST"
                                className="space-y-4"
                            >
                                <div>
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Name" 
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="email" 
                                        name="email"
                                        placeholder="Email" 
                                        required
                                        className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <select 
                                        name="major"
                                        className="w-full px-4 py-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="" className="bg-gray-800">Your Major (Optional)</option>
                                        <option value="cs" className="bg-gray-800">Computer Science</option>
                                        <option value="it" className="bg-gray-800">Information Technology</option>
                                        <option value="other" className="bg-gray-800">Other</option>
                                    </select>
                                </div>
                                <input type="hidden" name="_subject" value="New Newman Coding Club Signup!" />
                                <button 
                                    type="submit" 
                                    className="w-full bg-primary hover:bg-primary-accent text-white font-medium py-3 px-4 rounded-md transition-colors"
                                >
                                    Join the Club
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA