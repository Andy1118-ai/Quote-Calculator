document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("insuranceForm");
    const resultDiv = document.getElementById("result");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        resultDiv.textContent = ""; 

        const insuranceType = form.insuranceType.value;
        const ageValue = form.age.value;
        const coverageType = form.coverageLevel.value;

        // Validate fields
        if (!insuranceType || !ageValue || !coverageType) {
            resultDiv.textContent = "Please fill out all fields.";
            return;
        }

        const age = Number(ageValue);
        if (isNaN(age) || age < 1 || age > 120) {
            resultDiv.textContent = "please enter a valid age!";
            return;
        }

        try {
            const quote = calculateQuote(insuranceType, age, coverageType);
            resultDiv.textContent = `Your quote is: $${quote}`;

            setTimeout(() => {
                resultDiv.textContent = "";
            }, 5000); // 1

        } catch (err) {
            resultDiv.textContent = "Error calculating quote: " + err.message;
        }

        // Clear input fields after processing
        const fields = ['#firstName', '#lastName', '#age', '#insuranceType', '#coverageLevel'];
        fields.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.value = "";
            }
        });
    });

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
