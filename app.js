const originalAmountInput  = document.querySelector('.original-amount');

const amountElements  = document.querySelectorAll('.amount');
const spentInputs  = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you can't get the value of that element, just querySelector works fine
const remainingInputs  = document.querySelectorAll('.remaining-amount');

const totalSpentElement = document.querySelector('.total-spent');
const totalRemainingElement = document.querySelector('.total-remaining');
const addExpenseButton = document.querySelectorAll('.add-expense-button');

budgetAllocation();
addNewInput();

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

function addNewInput(){
    addExpenseButton.forEach((button) => {
        button.addEventListener('click', () => {
            console.log('Clicked');
        })
    })
}