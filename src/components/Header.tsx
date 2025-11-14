'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import Image from 'next/image';
import Container from './Container';
import { siteDetails } from '@/data/siteDetails';
import { menuItems } from '@/data/menuItems';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="supports-[backdrop-filter]:bg-white/80 bg-white/95 backdrop-blur fixed top-0 left-0 right-0 z-50 w-full shadow-md">
            <Container className="!px-0">
                <nav className="mx-auto flex justify-between items-center py-2 px-5 md:py-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image 
                            src="/images/logo.svg"
                            alt="Newman Coding Club Logo" 
                            width={28} 
                            height={28} 
                            className="min-w-fit w-7 h-7" 
                        />
                        <span className="manrope text-sm md:text-xl font-semibold text-foreground cursor-pointer whitespace-nowrap">
                            {siteDetails.siteName}
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex space-x-6">
                    {menuItems.map(item => (
                        <li key={item.text}>
                            <Link 
                            href={item.url.startsWith('#') ? `/${item.url}` : item.url} 
                            className="text-foreground hover:text-foreground-accent transition-colors"
                            >
                            {item.text}
                            </Link>
                        </li>
                    ))}
                        <li>
                            <Link href="/#join" className="text-white bg-primary hover:bg-primary-accent px-8 py-3 rounded-full transition-colors">
                                Join Us
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="bg-primary text-white focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiBars3 className="h-6 w-6" aria-hidden="true" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Mobile Menu with Transition */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="lg:hidden bg-white shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-1 pb-6 px-6">
                    {menuItems.map(item => (
                        <li key={item.text}>
                            <Link 
                            href={item.url.startsWith('#') ? `/${item.url}` : item.url} 
                            className="text-foreground hover:text-primary block" 
                            onClick={toggleMenu}
                            >
                            {item.text}
                            </Link>
                        </li>
                    ))}
                        <li>
                            <Link 
                                href="/#join" 
                                className="text-white bg-primary hover:bg-primary-accent px-5 py-2 rounded-full block w-fit" 
                                onClick={toggleMenu}
                            >
                                Join Us
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
