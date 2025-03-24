"use client"
import React, { useState } from "react";
import { ctaDetails } from "@/data/cta";

const CTA: React.FC = () => {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Handle email change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear errors on change
        setIsValidEmail(true);
        setErrorMessage("");
    };

    // Form validation
    const validateForm = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic email validation
        if (!email) {
            setIsValidEmail(false);
            setErrorMessage("Email is required");
            return false;
        }
        
        // Check if it's a Newman email
        if (!email.toLowerCase().endsWith("@newmanu.edu")) {
            setIsValidEmail(false);
            setErrorMessage("Please use your Newman University email (@newmanu.edu)");
            return false;
        }
        
        // If all validations pass
        setIsValidEmail(true);
        setErrorMessage("");
        
        // Submit the form
        const form = e.target as HTMLFormElement;
        form.submit();
        setSubmitted(true);
        
        return true;
    };

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
                            
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
                                    <p>We&apos;ve received your information and will keep you updated about club activities.</p>
                                </div>
                            ) : (
                                <form 
                                    action={process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT}
                                    method="POST"
                                    className="space-y-4"
                                    onSubmit={validateForm}
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
                                            placeholder="Newman Email (xyz@newmanu.edu)" 
                                            required
                                            value={email}
                                            onChange={handleEmailChange}
                                            className={`w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 border ${!isValidEmail ? 'border-red-500' : 'border-white/30'} focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                        />
                                        {!isValidEmail && (
                                            <p className="mt-1 text-left text-red-400 text-sm">{errorMessage}</p>
                                        )}
                                        <p className="mt-1 text-left text-white/60 text-xs">Help us fight bots! Please use your Newman University email address</p>
                                    </div>
                                    <div>
                                        <select 
                                            name="major"
                                            className="w-full px-4 py-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="" className="bg-gray-800">Your Major (Optional)</option>
                                            <option value="cs" className="bg-gray-800">Computer Science</option>
                                            <option value="it" className="bg-gray-800">Data Analytics</option>
                                            <option value="it" className="bg-gray-800">Other (STEM)</option>
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA