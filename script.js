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
            
            // Add countdown timer and redirect
            let timeLeft = 15;
            const countdownElement = document.createElement('div');
            countdownElement.style.textAlign = 'center';
            countdownElement.style.marginTop = '20px';
            document.body.appendChild(countdownElement);
            
            const countdownInterval = setInterval(() => {
                timeLeft--;
                countdownElement.textContent = `Redirecting to main form in ${timeLeft} seconds...`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = 'index.html';
                }
            }, 1000);
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
                    resultDiv.textContent = `Your quote is: $${quote.toFixed(2)} `;
                    resultDiv.style.display = 'block';
                }

                // Redirect to results page after 5 seconds
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
            baseRate = 500;
        } else if (insuranceType === "health") {
            baseRate = 300;
        } else {
            throw new Error("Invalid insurance type");
        }

        let additionalCharge = 0;
        if (insuranceType === "auto" && age < 25) {
            additionalCharge += 100;
        }
        if (coverageType === "premium") {
            additionalCharge += 200;
        }

        return baseRate + additionalCharge;
    }
});
