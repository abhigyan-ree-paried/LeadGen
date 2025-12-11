import { useState } from 'react'
import { MdPhoneAndroid, MdBatteryChargingFull, MdWaterDrop, MdCameraAlt, MdPowerInput } from 'react-icons/md'
import { saveToSheet } from '../utils/sheets'
import { sendOTP, verifyOTP } from '../utils/twilioAPI'

function Hero() {
    const [formData, setFormData] = useState({
        countryCode: '+91',
        mobile: '',
        repair: '',
        brand: '',
        model: ''
    })

    const [showOtpModal, setShowOtpModal] = useState(false)
    const [showThankYouModal, setShowThankYouModal] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [currentRowId, setCurrentRowId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(3)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)

        setIsLoading(true)
        setError('')

        try {
            // Send OTP via Twilio
            const phoneNumber = formData.countryCode + formData.mobile
            const result = await sendOTP(phoneNumber)
            console.log('OTP sent:', result)

            // Show OTP modal
            setShowOtpModal(true)
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.')
            console.error('Error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
            // Reset model when brand changes
            ...(name === 'brand' && { model: '' })
        })
    }

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Auto-focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus()
            }
        }
    }

    const handleOtpSubmit = async (e) => {
        e.preventDefault()
        const otpCode = otp.join('')
        console.log('OTP submitted:', otpCode)

        setIsLoading(true)
        setError('')

        try {
            // Verify OTP via Twilio backend
            const phoneNumber = formData.countryCode + formData.mobile
            const result = await verifyOTP(phoneNumber, otpCode)
            console.log('OTP verified:', result)

            // Save to Google Sheets with verified status
            await saveToSheet(formData, 'Yes')

            setShowOtpModal(false)
            setOtp(['', '', '', '', '', ''])
            setShowThankYouModal(true)

            // Start countdown and redirect
            let count = 3
            setCountdown(count)
            const timer = setInterval(() => {
                count--
                setCountdown(count)
                if (count === 0) {
                    clearInterval(timer)
                    window.location.href = 'https://reepaired.com/'
                }
            }, 1000)
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.')
            console.error('Verification error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const repairTypes = [
        'Screen Replacement',
        'Battery Replacement',
        'Water Damage',
        'Charging Port',
        'Camera Issue',
        'Software Issue',
        'Speaker/Microphone',
        'Dead phone',
        'Other'
    ]

    const brands = [
        'Apple',
        'Samsung',
        'OnePlus',
        'Google Pixel',
        'Xiaomi',
        'Oppo',
        'Vivo',
        'Realme',
        'Other'
    ]

    // Phone models for each brand
    const phoneModels = {
        'Apple': [
            'iPhone 15 Pro Max',
            'iPhone 15 Pro',
            'iPhone 15 Plus',
            'iPhone 15',
            'iPhone 14 Pro Max',
            'iPhone 14 Pro',
            'iPhone 14 Plus',
            'iPhone 14',
            'iPhone 13 Pro Max',
            'iPhone 13 Pro',
            'iPhone 13',
            'iPhone 12 Pro Max',
            'iPhone 12 Pro',
            'iPhone 12',
            'iPhone 11 Pro Max',
            'iPhone 11 Pro',
            'iPhone 11',
            'iPhone XS Max',
            'iPhone XS',
            'iPhone XR',
            'iPhone X',
            'Other'
        ],
        'Samsung': [
            'Galaxy S24 Ultra',
            'Galaxy S24+',
            'Galaxy S24',
            'Galaxy S23 Ultra',
            'Galaxy S23+',
            'Galaxy S23',
            'Galaxy S22 Ultra',
            'Galaxy S22+',
            'Galaxy S22',
            'Galaxy S21 Ultra',
            'Galaxy S21+',
            'Galaxy S21',
            'Galaxy Z Fold 5',
            'Galaxy Z Fold 4',
            'Galaxy Z Flip 5',
            'Galaxy Z Flip 4',
            'Galaxy A54',
            'Galaxy A34',
            'Galaxy A24',
            'Galaxy M34',
            'Other'
        ],
        'OnePlus': [
            'OnePlus 12',
            'OnePlus 11',
            'OnePlus 10 Pro',
            'OnePlus 10T',
            'OnePlus 9 Pro',
            'OnePlus 9',
            'OnePlus 8 Pro',
            'OnePlus 8',
            'OnePlus Nord 3',
            'OnePlus Nord CE 3',
            'OnePlus Nord 2',
            'Other'
        ],
        'Google Pixel': [
            'Pixel 8 Pro',
            'Pixel 8',
            'Pixel 7 Pro',
            'Pixel 7',
            'Pixel 6 Pro',
            'Pixel 6',
            'Pixel 5',
            'Pixel 4a',
            'Other'
        ],
        'Xiaomi': [
            'Xiaomi 14 Pro',
            'Xiaomi 14',
            'Xiaomi 13 Pro',
            'Xiaomi 13',
            'Xiaomi 12 Pro',
            'Xiaomi 12',
            'Redmi Note 13 Pro+',
            'Redmi Note 13 Pro',
            'Redmi Note 13',
            'Redmi Note 12 Pro+',
            'Redmi Note 12 Pro',
            'Redmi Note 12',
            'Poco X6 Pro',
            'Poco X6',
            'Poco F5',
            'Other'
        ],
        'Oppo': [
            'Oppo Find X6 Pro',
            'Oppo Find X5 Pro',
            'Oppo Reno 11 Pro',
            'Oppo Reno 11',
            'Oppo Reno 10 Pro+',
            'Oppo Reno 10 Pro',
            'Oppo Reno 10',
            'Oppo F25 Pro',
            'Oppo A79',
            'Oppo A59',
            'Other'
        ],
        'Vivo': [
            'Vivo X100 Pro',
            'Vivo X90 Pro',
            'Vivo V30 Pro',
            'Vivo V30',
            'Vivo V29 Pro',
            'Vivo V29',
            'Vivo T2 Pro',
            'Vivo T2',
            'Vivo Y100',
            'Vivo Y56',
            'Other'
        ],
        'Realme': [
            'Realme GT 5 Pro',
            'Realme GT 3',
            'Realme 12 Pro+',
            'Realme 12 Pro',
            'Realme 11 Pro+',
            'Realme 11 Pro',
            'Realme Narzo 60 Pro',
            'Realme Narzo 60',
            'Realme C67',
            'Realme C55',
            'Other'
        ],
        'Other': [
            'Other Model'
        ]
    }

    // Get models based on selected brand
    const getModelsForBrand = () => {
        if (!formData.brand) return []
        return phoneModels[formData.brand] || []
    }

    const services = [
        { name: 'Screen Repair', icon: MdPhoneAndroid },
        { name: 'Battery Replace', icon: MdBatteryChargingFull },
        { name: 'Water Damage', icon: MdWaterDrop },
        { name: 'Camera Repair', icon: MdCameraAlt },
        { name: 'Charging Port', icon: MdPowerInput }
    ]

    return (
        <section className="bg-[#FDF3EB] min-h-full h-[95vh] overflow-auto lg:overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-8 lg:py-0">
                {/* Title - Hidden on mobile */}
                {/* <h2 className="hidden lg:block text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4 text-center">
                    Price Comparison Chart
                </h2> */}

                <div className="grid lg:flex lg:justify-center gap-6 items-start">
                    {/* Price Comparison Table - Hidden on mobile, visible on desktop */}
                    {/* <div className="hidden lg:block lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md border border-[#E5E5E5] overflow-hidden">
                            {/* Table Header */}
                    {/* <div className="grid grid-cols-4 gap-6 px-8 py-6 bg-white border-b-2 border-[#F0F0F0]">
                                <div className="text-center">
                                    <svg className="w-7 h-7 text-[#1A1A1A] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Phone Name</p>
                                </div>
                                <div className="text-center">
                                    <svg className="w-7 h-7 text-[#1A1A1A] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Dealership</p>
                                    <p className="text-xs text-[#888888] mt-1.5">Price (₹)</p>
                                </div>
                                <div className="text-center">
                                    <svg className="w-7 h-7 text-[#1A1A1A] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Competitor</p>
                                    <p className="text-xs text-[#888888] mt-1.5">Price (₹)</p>
                                </div>
                                <div className="text-center">
                                    <svg className="w-7 h-7 text-[#FF8A00] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <p className="text-xs font-bold text-[#FF8A00] uppercase tracking-wider">Our Price</p>
                                    <p className="text-xs text-[#888888] mt-1.5">(₹)</p>
                                </div>
                            </div> */}

                    {/* Table Body */}
                    {/* <div className="divide-y divide-[#F0F0F0]">
                                {[
                                    { name: 'iPhone 14', dealership: 8500, competitor: 8200, ourPrice: 4999 },
                                    { name: 'iPhone 13', dealership: 7500, competitor: 7200, ourPrice: 4499 },
                                    { name: 'Samsung S23', dealership: 6500, competitor: 6200, ourPrice: 3999 },
                                    { name: 'OnePlus 11', dealership: 5500, competitor: 5200, ourPrice: 3499 },
                                    { name: 'Pixel 7', dealership: 5000, competitor: 4800, ourPrice: 3299 },
                                    { name: 'Xiaomi 13', dealership: 4500, competitor: 4200, ourPrice: 2999 }
                                ].map((phone, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-4 gap-6 px-8 py-5 hover:bg-[#FFFBF7] transition-colors"
                                    >
                                        <div className="flex items-center justify-center">
                                            <p className="font-bold text-[#1A1A1A] text-base">{phone.name}</p>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <p className="text-[#555555] text-base font-medium">{phone.dealership}</p>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <p className="text-[#555555] text-base font-medium">{phone.competitor}</p>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <p className="text-2xl font-bold text-[#FF8A00]">{phone.ourPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div> */}

                    {/* Footer */}
                    {/* <div className="px-8 py-4 bg-[#FAFAFA] border-t border-[#E5E5E5]">
                                <p className="text-xs text-[#888888] text-center italic">
                                    Service prices were compared in Dec 2024
                                </p>
                            </div>
                        </div>
                    </div> */}

                    {/* Request Callback Form - Full width on mobile, centered on desktop */}
                    <div className="w-full lg:w-auto lg:max-w-md -mt-30 md:mt-1">
                        {/* Heading outside the form */}
                        <h3 className="text-3xl lg:text-2xl font-bold text-black mb-4">
                            India's Fastest Doorstep <br /> <span className='text-[#5C46C2]'> Smartphone Repair Service</span>
                        </h3>

                        <div className="bg-white rounded-2xl shadow-md border border-[#E5E5E5] p-6 lg:p-8 mt-10">
                            <div className="mb-6">
                                <p className="text-[#666666] text-lg font-semibold">Request a Call Back</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Mobile Number */}
                                <div className="flex gap-2">
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        className="w-20 lg:w-24 px-2 lg:px-3 py-3 text-sm border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent bg-white font-medium"
                                    >
                                        <option value="+91">+91</option>
                                        <option value="+97">+97</option>
                                        <option value="+1">+1</option>
                                        <option value="+44">+44</option>
                                    </select>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter Mobile Number"
                                        className="flex-1 px-4 py-3 text-sm border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Email Address */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter Email Address"
                                        className="w-full px-4 py-3 text-sm border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Select Repair */}
                                <div className="relative">
                                    <select
                                        name="repair"
                                        value={formData.repair}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 text-sm border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent appearance-none bg-white"
                                        required
                                    >
                                        <option value="">Select Repair</option>
                                        {repairTypes.map((repair, index) => (
                                            <option key={index} value={repair}>{repair}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 text-[#999999] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Brand and Model */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <select
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            className="w-full px-3 lg:px-4 py-3 text-sm border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Phone Brand</option>
                                            {brands.map((brand, index) => (
                                                <option key={index} value={brand}>{brand}</option>
                                            ))}
                                        </select>
                                        <svg className="w-4 h-4 text-[#999999] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    <div className="relative">
                                        <select
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            className="w-full px-3 lg:px-4 py-3 text-sm border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            required
                                            disabled={!formData.brand}
                                        >
                                            <option value="">{formData.brand ? 'Select Model' : 'Select Brand First'}</option>
                                            {getModelsForBrand().map((model, index) => (
                                                <option key={index} value={model}>{model}</option>
                                            ))}
                                        </select>
                                        <svg className="w-4 h-4 text-[#999999] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#FB833A] hover:bg-[#E67A00] text-white font-bold py-4 rounded-3xl transition-all duration-200 text-base shadow-md hover:shadow-lg mt-6 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10">
                                        {isLoading ? 'Sending OTP...' : 'Request a Callback'}
                                    </span>
                                    {/* Flash animation */}
                                    {!isLoading && (
                                        <span className="absolute inset-0 w-[65%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-69 animate-flash"></span>
                                    )}
                                </button>

                                <style jsx>{`
                                    @keyframes flash {
                                        0%, 100% {
                                            transform: translateX(-150%);
                                            opacity: 0;
                                        }
                                        10% {
                                            opacity: 1;
                                        }
                                        90% {
                                            opacity: 1;
                                        }
                                        100% {
                                            transform: translateX(550%);
                                            opacity: 0;
                                        }
                                    }
                                    
                                    .animate-flash {
                                        animation: flash 2s ease-out infinite;
                                        animation-delay: 0.2s;
                                    }

                                    /* Bolder placeholder text */
                                    input::placeholder,
                                    select option[value=""] {
                                        font-weight: 600;
                                        opacity: 1;
                                    }

                                    /* Bolder text in inputs and select dropdowns */
                                    input,
                                    select {
                                        font-weight: 600;
                                    }
                                `}</style>
                            </form>
                        </div>

                        {/* Our Services Section - Mobile only */}
                        <div className="lg:hidden mt-15">
                            <h3 className="text-2xl font-bold text-[#6B7280] text-center mb-6">Our Services</h3>
                            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                {services.map((service, index) => {
                                    const IconComponent = service.icon
                                    return (
                                        <div key={index} className="bg-[#FFF4E6] rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow border border-[#FF8A00]">
                                            <IconComponent className="text-[#FF8A00] text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2" />
                                            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-[#6B7280] text-center leading-tight">{service.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4 backdrop-blur-[13px]">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#FF8A00] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-[#FF8A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Enter OTP</h3>
                            <p className="text-[#666666] text-sm">
                                We've sent a verification code to<br />
                                <span className="font-semibold text-[#1A1A1A]">{formData.countryCode} {formData.mobile}</span>
                            </p>
                        </div>

                        <form onSubmit={handleOtpSubmit}>
                            <div className="flex gap-2 justify-center mb-6">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        className="w-12 h-12 text-center text-xl font-bold border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                                        required
                                    />
                                ))}
                            </div>

                            {/* Error Message in OTP Modal */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-3 rounded-xl transition-all duration-200 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>


                            <button
                                type="button"
                                onClick={async () => {
                                    // Update Google Sheets with cancelled status
                                    await saveToSheet(formData, 'No')
                                    setShowOtpModal(false)
                                    setShowThankYouModal(true)

                                    // Start countdown and redirect
                                    let count = 3
                                    setCountdown(count)
                                    const timer = setInterval(() => {
                                        count--
                                        setCountdown(count)
                                        if (count === 0) {
                                            clearInterval(timer)
                                            window.location.href = 'https://reepaired.com/'
                                        }
                                    }, 1000)
                                }}
                                className="w-full text-[#666666] hover:text-[#1A1A1A] font-medium py-2 transition-colors"
                            >
                                Cancel
                            </button>

                            <p className="text-center text-sm text-[#666666] mt-4">
                                Didn't receive code? <button type="button" className="text-[#FF8A00] font-semibold hover:underline">Resend</button>
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Thank You Modal */}
            {showThankYouModal && (
                <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4 backdrop-blur-[13px]">
                    <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-[#FF8A00] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Thank You Message */}
                        <h3 className="text-3xl font-bold text-[#1A1A1A] mb-3">Thank You!</h3>
                        <p className="text-[#666666] text-base mb-4">
                            Your request has been submitted successfully.<br />
                            We'll call you back soon.
                        </p>

                        {/* Countdown */}
                        <div className="text-sm text-[#999999]">
                            Redirecting in <span className="font-bold text-[#FF8A00]">{countdown}</span> seconds...
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Hero
