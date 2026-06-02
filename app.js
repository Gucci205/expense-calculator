const originalAmountInput  = document.querySelector('.original-amount');

const amountElements  = document.querySelectorAll('.amount');
const spentInputs  = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you cant get the value of that element, just querySelector works fine
const remainingInputs  = document.querySelectorAll('.remaining-amount');

const totalSpentElement = document.querySelector('.total-spent');
const totalRemainingElement = document.querySelector('.total-remaining');

budgetAllocation();

function budgetAllocation(){
    const originalAmount = Number(originalAmountInput .value);

    const allocations = calculateAllocations(originalAmount);

    let totalSpent = 0;
    let totalRemaining = 0;
    
    allocations.forEach((amount, index) => {
        const spent = Number(spentInputs[index].value);
        const remaining = amount - spent;

        totalSpent += spent;
        totalRemaining += remaining;

        amountElements[index].textContent = amount.toLocaleString();
        amountElements[index].style.fontFamily = 'Times New Roman';

        spentInputs[index].value = spent.toLocaleString();
        remainingInputs[index].value = remaining.toLocaleString();
    });

    originalAmountInput.value = addCommas(originalAmount);
    totalSpentElement.textContent = addCommas(totalSpent);
    totalRemainingElement.textContent = addCommas(totalRemaining);
}

function calculateAllocations(total){
    return [
        total * 0.5,
        total * 0.3,
        total * 0.2
    ];
}

function addCommas(value){
    const digits = String(value).split('').reverse();

    let result = '';
    let count = 0;

    for(let i = 0; i < digits.length; i++){
        result+= digits[i];
        count++;
    // Add a comma every 3 digits, but only if there are still digits left to process
        if(count % 3 === 0 && i !== digits.length-1){
            result+= ',';
        }
    }

    return result.split('').reverse().join('');
}

// const needs = originalAmount * 0.5;
// const wants = originalAmount * 0.3;
// const saving = originalAmount * 0.2;

// const arrayOfAmounts = [needs, wants, saving];

// amountElements.forEach((getAmount, index) => {
//     const amountIndex = arrayOfAmounts[index];
//     const spentAmountValue = spentInputs[index].value;
//     const remainingAmount = remainingInputs[index];

//     getAmount.innerHTML = amountIndex; //placing amount to respective p tag
//     getAmount.style.fontFamily = 'Times New Roman';
    
//     remainingAmount.value = amountIndex - spentAmountValue;
//     totalSpent += Number(spentAmountValue);
//     totalRemaining += Number(remainingAmount.value);

//     const values = [
//         String(amountIndex),
//         spentAmountValue,
//         remainingAmount.value
//     ];

//     const formattedValues = [];

//     for(value of values){
//         let arr = [];
//         for(digit of value){
//             arr.push(digit);
//         }
//         arr.reverse();

//         let str = '';
//         let count = 0;
//         for(let i = 0; i < arr.length; i++){
//             str+= arr[i];
//             count++;
//             // Add a comma every 3 digits, but only if there are still digits left to process
//             if(count % 3 === 0 && i !== arr.length-1){
//                 str+= ',';
//             }
//         }

//         formattedValues.push(
//             str.split('').reverse().join('')
//         );
//     }

//     getAmount.innerHTML = formattedValues[0];
//     spentInputs[index].value = formattedValues[1];
//     remainingInputs[index].value = formattedValues[2];

//     //Declarative way of adding commas
//     originalAmountInput.value = originalAmount.toLocaleString();
//     totalSpentElement.innerHTML = totalSpent.toLocaleString();
//     totalRemainingElement.innerHTML = totalRemaining.toLocaleString();
// });