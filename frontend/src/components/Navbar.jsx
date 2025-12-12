import { useState } from 'react'
import logo from '../assets/logo.avif'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-[#FDF3EB] border-b border-[#E5E5E5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16 lg:h-28">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Ree.Paired Logo"
                            className="h-7 sm:h-8 lg:h-10 w-auto"
                        />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[#1A1A1A] hover:text-[#FF8A00] p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="relative group">
                            <button className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors flex items-center gap-1">
                                All Pages
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <a href="#about" className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors">
                            About
                        </a>
                        <a href="#service" className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors">
                            Service
                        </a>
                        <a href="#blog" className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors">
                            Blog
                        </a>
                    </div>

                    {/* Book Now Button - Desktop */}
                    <div className="hidden md:flex items-center">
                        <button className="bg-[#5C46C2] text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 hover:shadow-lg">
                            Book Now
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-6 border-t border-[#E5E5E5]">
                        <div className="flex flex-col space-y-4">
                            <button className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors flex items-center justify-between">
                                All Pages
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <a href="#about" className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors">
                                About
                            </a>
                            <a href="#service" className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors">
                                Service
                            </a>
                            <a href="#blog" className="text-[#1A1A1A] hover:text-[#FF8A00] font-medium text-base transition-colors">
                                Blog
                            </a>
                            <button className="bg-[#5C46C2] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg w-full">
                                Book Now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
