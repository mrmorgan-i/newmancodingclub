"use client"
import React, { useState } from "react";
import { ctaDetails } from "@/data/cta";

const CTA: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [major, setMajor] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPhone, setIsValidPhone] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Handle name change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    // Handle email change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        // Clear errors on change
        setIsValidEmail(true);
        setEmailErrorMessage("");
    };

    // Handle phone change and formatting
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-digit characters
        const rawPhone = e.target.value.replace(/\D/g, '');
        
        // Format the phone number
        let formattedPhone = '';
        if (rawPhone.length > 0) {
            formattedPhone = `(${rawPhone.slice(0, 3)}${rawPhone.length > 3 ? `) ${rawPhone.slice(3, 6)}` : ''}${rawPhone.length > 6 ? `-${rawPhone.slice(6, 10)}` : ''}`;
        }
        
        setPhone(formattedPhone);
        
        // Clear errors on change
        setIsValidPhone(true);
        setPhoneErrorMessage("");
    };

    // Handle major change
    const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMajor(e.target.value);
    };

    // Validate phone number
    const validatePhoneNumber = (phoneNum: string): boolean => {
        // Remove non-digit characters for validation
        const cleanPhone = phoneNum.replace(/\D/g, '');
        
        // Check if the phone number is exactly 10 digits
        return cleanPhone.length === 10;
    };

    // Form validation
    const validateForm = (): boolean => {
        let isValid = true;
        
        // Email validation
        if (!email) {
            setIsValidEmail(false);
            setEmailErrorMessage("Email is required");
            isValid = false;
        } else if (!email.toLowerCase().endsWith("@newmanu.edu")) {
            setIsValidEmail(false);
            setEmailErrorMessage("Please use your Newman University email (@newmanu.edu)");
            isValid = false;
        }
        
        // Phone validation
        if (!phone) {
            setIsValidPhone(false);
            setPhoneErrorMessage("Phone number is required");
            isValid = false;
        } else if (!validatePhoneNumber(phone)) {
            setIsValidPhone(false);
            setPhoneErrorMessage("Please enter a valid 10-digit phone number");
            isValid = false;
        }
        
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSubmissionStatus('submitting');
        
        try {
            const response = await fetch('/api/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    major
                }),
            });
            
            if (response.ok) {
                setSubmissionStatus('success');
                // Reset form
                setName("");
                setEmail("");
                setPhone("");
                setMajor("");
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus('error');
        }
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
                            
                            {submissionStatus === 'success' ? (
                                <div className="text-center py-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h4 className="text-xl font-semibold mb-4">Welcome to the Club!</h4>
                                    
                                    <a 
                                        href="https://groupme.com/join_group/106407244/ylKLTabX" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="block w-full bg-primary hover:bg-primary-accent text-white font-medium py-3 px-4 rounded-md transition-colors mb-4"
                                    >
                                        Join Our GroupMe
                                    </a>
                                    
                                    <p className="text-sm opacity-90">
                                        We&apos;ve sent you a welcome email with additional information. Please check your inbox (and junk folder)--and pretty please add us to your contacts!
                                    </p>
                                </div>
                            ) : (
                                <form 
                                    className="space-y-4"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <input 
                                            type="text" 
                                            name="name"
                                            placeholder="Name" 
                                            required
                                            value={name}
                                            onChange={handleNameChange}
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
                                            <p className="mt-1 text-left text-red-400 text-sm">{emailErrorMessage}</p>
                                        )}
                                        <p className="mt-1 text-left text-white/60 text-xs">Help us fight bots! Please use your Newman University email address</p>
                                    </div>
                                    <div>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="Phone Number (For GroupMe)" 
                                            required
                                            className={`w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-white/60 border ${!isValidPhone ? 'border-red-500' : 'border-white/30'} focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                        />
                                        {!isValidPhone && (
                                            <p className="mt-1 text-left text-red-400 text-sm">{phoneErrorMessage}</p>
                                        )}
                                        <p className="mt-1 text-left text-white/60 text-xs">Please enter a 10-digit phone number to be added to our GroupMe</p>
                                    </div>
                                    <div>
                                        <select 
                                            name="major"
                                            value={major}
                                            onChange={handleMajorChange}
                                            className="w-full px-4 py-3 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        >
                                            <option value="" className="bg-gray-800">Your Major (Optional)</option>
                                            <option value="fa" className="bg-gray-800">Fine Arts</option>
                                            <option value="hc" className="bg-gray-800">Healthcare</option>
                                            <option value="stem" className="bg-gray-800">STEM</option>
                                            <option value="da" className="bg-gray-800">Data Analytics</option>
                                            <option value="cs" className="bg-gray-800">Computer Science</option>                             
                                        </select>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={submissionStatus === 'submitting'}
                                        className="w-full bg-primary hover:bg-primary-accent text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
                                    >
                                        {submissionStatus === 'submitting' ? 'Processing...' : 'Join the Club'}
                                    </button>
                                    {submissionStatus === 'error' && (
                                        <p className="text-red-400 text-sm">There was a problem processing your request. Please try again.</p>
                                    )}
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