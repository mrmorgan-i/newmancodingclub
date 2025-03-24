import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

import { siteDetails } from '@/data/siteDetails';
import { footerDetails } from '@/data/footer';
import { getPlatformIconByName } from '@/utils';

const Footer: React.FC = () => {
    return (
        <footer className="bg-hero-background text-foreground py-10">
            <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <Link href="/" className="flex items-center gap-2">
                        <Image 
                            src="/images/logo.svg" 
                            alt="Newman Coding Club Logo" 
                            width={20} 
                            height={20} 
                            className="min-w-fit w-7 h-7" 
                        />
                        <h3 className="manrope text-xl font-semibold cursor-pointer">
                            {siteDetails.siteName}
                        </h3>
                    </Link>
                    <p className="mt-3.5 text-foreground-accent">
                        {footerDetails.subheading}
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="text-foreground-accent">
                        {footerDetails.quickLinks.map(link => (
                            <li key={link.text} className="mb-2">
                                <Link href={link.url} className="hover:text-foreground">{link.text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contact Us</h4>

                    {footerDetails.email && <a href={`mailto:${footerDetails.email}`}  className="block text-foreground-accent hover:text-foreground">Email: {footerDetails.email}</a>}

                    {footerDetails.telephone && <a href={`tel:${footerDetails.telephone}`} className="block text-foreground-accent hover:text-foreground">Phone: {footerDetails.telephone}</a>}

                    {footerDetails.socials && (
                        <div className="mt-5 flex items-center gap-5 flex-wrap">
                            {Object.keys(footerDetails.socials).map(platformName => {
                                if (platformName && footerDetails.socials[platformName]) {
                                    return (
                                        <Link
                                            href={footerDetails.socials[platformName]}
                                            key={platformName}
                                            aria-label={platformName}
                                            className="text-foreground-accent hover:text-primary"
                                        >
                                            {getPlatformIconByName(platformName)}
                                        </Link>
                                    )
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 md:text-center text-foreground-accent px-6">
                <p>Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.</p>
                
                {/* Updated powered by section with responsive classes */}
                <div className="flex flex-wrap items-center justify-center mt-4">
                    <p className="text-sm font-bold mr-2 w-full text-center md:w-auto">Powered by</p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-2 md:mt-0">
                        <a href="https://newmanu.edu" target="_blank" rel="noopener noreferrer" className="inline-block">
                            <Image 
                                src="/images/newman-university-logo.png" 
                                alt="Newman University" 
                                width={128} 
                                height={128} 
                                className="h-6 w-32 md:h-8 md:w-40"
                            />
                        </a>
                        <a href="https://devict.org" target="_blank" rel="noopener noreferrer" className="inline-block">
                            <Image 
                                src="/images/devict-logo.png"
                                alt="devICT"
                                width={128}
                                height={128}
                                className="h-6 md:h-8"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;