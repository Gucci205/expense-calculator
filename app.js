const getAmountInputValue = document.querySelector('.amountInput').value;
const getAmounts = document.querySelectorAll('.amount');
const getSpentAmount = document.querySelectorAll('#spentAmount');

console.log(getSpentAmount);

function budgetAllocation(){
    const numberCasting = Number(getAmountInputValue);
    const needs = numberCasting * 0.5;

    const wants = numberCasting * 0.3;

    const saving = numberCasting * 0.2;

    const arrayOfAmounts = [needs, wants, saving];
    // console.log(arrayOfAmounts);

    getAmounts.forEach((amount, index) => {
        amount.innerHTML = arrayOfAmounts[index];
        amount.style.fontFamily = 'Times New Roman'
    })
}

function calculation(){
}


budgetAllocation();
calculation();