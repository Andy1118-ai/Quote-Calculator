document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("insuranceForm");
    const resultDiv = document.getElementById("result");
    
    // Check if we're on the results page
    if (window.location.pathname.includes('results.html')) {
        // Get the stored data from localStorage
        const formData = JSON.parse(localStorage.getItem('quoteData'));
        if (formData) {
            document.getElementById('fullName').textContent = `${formData.firstName} ${formData.lastName}`;
            document.getElementById('ageResult').textContent = formData.age;
            document.getElementById('insuranceTypeResult').textContent = formData.insuranceType;
            document.getElementById('coverageLevelResult').textContent = formData.coverageLevel;
            document.getElementById('quoteAmount').textContent = formData.quote.toFixed(2);
        }
        return;
    }

    // Check if we're on the receipt page
    if (window.location.pathname.includes('receipt.html')) {
        // Get the stored data from localStorage
        const formData = JSON.parse(localStorage.getItem('quoteData'));
        if (formData) {
            document.getElementById('fullName').textContent = `${formData.firstName} ${formData.lastName}`;
            document.getElementById('ageResult').textContent = formData.age;
            document.getElementById('insuranceTypeResult').textContent = formData.insuranceType;
            document.getElementById('coverageLevelResult').textContent = formData.coverageLevel;
            document.getElementById('quoteAmount').textContent = formData.quote.toFixed(2);
            
            // Set transaction ID
            const transactionId = generateTransactionId();
            document.getElementById('transactionId').textContent = transactionId;
            
            // Set current date
            document.getElementById('currentDate').textContent = getCurrentDate();
        }
        return;
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const firstName = form.firstName.value;
            const lastName = form.lastName.value;
            const insuranceType = form.insuranceType.value;
            const ageValue = form.age.value;
            const coverageType = form.coverageLevel.value;

            // Validate fields
            if (!firstName || !lastName || !insuranceType || !ageValue || !coverageType) {
                alert("Please fill out all fields.");
                return;
            }

            const age = Number(ageValue);
            if (isNaN(age) || age < 1 || age > 120) {
                alert("Please enter a valid age!");
                return;
            }

            try {
                const quote = calculateQuote(insuranceType, age, coverageType);
                
                // Store the data in localStorage
                const formData = {
                    firstName,
                    lastName,
                    age,
                    insuranceType,
                    coverageLevel: coverageType,
                    quote
                };
                localStorage.setItem('quoteData', JSON.stringify(formData));

                // Show the quote on the main page
                if (resultDiv) {
                    resultDiv.textContent = `Your quote is: KES ${quote.toFixed(2)} `;
                    resultDiv.style.display = 'block';
                }

                // Redirect to results page after 1 second
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 1000);

            } catch (err) {
                alert("Error calculating quote: " + err.message);
            }
        });
    }

    function calculateQuote(insuranceType, age, coverageType) {
        let baseRate = 0;
        
        if (insuranceType === "auto") {
            baseRate = 50000; // Changed to KES
        } else if (insuranceType === "health") {
            baseRate = 30000; // Changed to KES
        } else {
            throw new Error("Invalid insurance type");
        }

        let additionalCharge = 0;
        if (insuranceType === "auto" && age < 25) {
            additionalCharge += 10000; // Changed to KES
        }
        if (coverageType === "premium") {
            additionalCharge += 20000; // Changed to KES
        }

        return baseRate + additionalCharge;
    }
});

// Function to generate a random transaction ID
function generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRX${timestamp}${random}`;
}

// Function to format current date
function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
