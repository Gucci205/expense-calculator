const getOriginalAmount = document.querySelector('.original-amount');
const getAmounts = document.querySelectorAll('.amount');
const getSpentAmount = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you cant get the value of that element, just querySelector works fine
const getRemainingAmount = document.querySelectorAll('.remaining-amount');
const getTotalSpentAmount = document.querySelector('.total-spent');
const getTotalRemainingAmount = document.querySelector('.total-remaining');

// console.log(getTotalSpentAmount, getTotalRemainingAmount);

budgetAllocation();

function budgetAllocation(){
    const numberCasting = Number(getOriginalAmount.value);

    const needs = numberCasting * 0.5;
    const wants = numberCasting * 0.3;
    const saving = numberCasting * 0.2;

    const arrayOfAmounts = [needs, wants, saving];
    
    let sumOfSpent = 0;
    let sumOfRemain = 0;

    getAmounts.forEach((getAmount, index) => {
        const amountIndex = arrayOfAmounts[index];
        const spentAmountValue = getSpentAmount[index].value;
        const remainingAmount = getRemainingAmount[index];

        getAmount.innerHTML = amountIndex; //placing amount to respective p tag
        getAmount.style.fontFamily = 'Times New Roman';
        
        remainingAmount.value = amountIndex - spentAmountValue;
        sumOfSpent += Number(spentAmountValue);
        sumOfRemain += Number(remainingAmount.value);

        const values = [
            String(amountIndex),
            spentAmountValue,
            remainingAmount.value
        ];

        const formattedValues = [];

        for(value of values){
            let arr = [];
            for(digit of value){
                arr.push(digit);
            }
            arr.reverse();

            let str = '';
            let count = 0;
            for(let i = 0; i < arr.length; i++){
                str+= arr[i];
                count++;
                // Add a comma every 3 digits, but only if there are still digits left to process
                if(count % 3 === 0 && i !== arr.length-1){
                    str+= ',';
                }
            }

            formattedValues.push(
                str.split('').reverse().join('')
            );
        }

        getAmount.innerHTML = formattedValues[0];
        getSpentAmount[index].value = formattedValues[1];
        getRemainingAmount[index].value = formattedValues[2];

        //Declarative way of adding commas
        getOriginalAmount.value = numberCasting.toLocaleString();
        getTotalSpentAmount.innerHTML = sumOfSpent.toLocaleString();
        getTotalRemainingAmount.innerHTML = sumOfRemain.toLocaleString();
    });
}