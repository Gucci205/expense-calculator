const getAmountInputValue = document.querySelector('.amountInput').value;
const getAmounts = document.querySelectorAll('.amount');
const getSpentAmount = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you cant get the value of that element, just querySelector works fine
const getRemainingAmount = document.querySelectorAll('.remaining-amount');

// console.log(getAmountInputValue);
// console.log(getAmounts);
// console.log(getSpentAmount);
console.log(getRemainingAmount);

function budgetAllocation(){
    const numberCasting = Number(getAmountInputValue);
    const needs = numberCasting * 0.5;

    const wants = numberCasting * 0.3;

    const saving = numberCasting * 0.2;

    const arrayOfAmounts = [needs, wants, saving];
    // console.log(arrayOfAmounts);

    getAmounts.forEach((getAmount, index) => {
        getAmount.innerHTML = arrayOfAmounts[index]; //placing amount to respective p tag
        getAmount.style.fontFamily = 'Times New Roman';
        
        console.log(arrayOfAmounts[index] - getSpentAmount[index].value);
        
        console.log(getRemainingAmount[index].value);
        getRemainingAmount[index].value = arrayOfAmounts[index] - getSpentAmount[index].value;
    });
}

// function calculation(){
//     console.log(needs);
// }


budgetAllocation();
// calculation();