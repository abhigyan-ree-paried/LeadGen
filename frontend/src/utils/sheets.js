// Google Sheets Integration
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyB5xyhrGt-SeqlwuJo7mN2h1YzIHhttRLrXg6PzBacZu7NvaMESfbw-xfjSNEDE80OKg/exec';

export const saveToSheet = async (formData, otpStatus = 'Pending', rowId = null) => {
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timestamp: new Date().toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'short'
                }),
                phone: "'" + formData.countryCode + formData.mobile, // Add apostrophe to force text format
                repair: formData.repair,
                brand: formData.brand,
                model: formData.model,
                otpVerified: otpStatus,
                status: otpStatus === 'Yes' ? 'Completed' :
                    otpStatus === 'No' ? 'Cancelled' : 'Pending',
                rowId: rowId
            })
        });

        //the data will still be saved to the sheet
        return { success: true };
    } catch (error) {
        console.error('Error saving to sheet:', error);
        return { success: false, error };
    }
};
