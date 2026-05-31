const getOriginalAmount = document.querySelector('.original-amount').value;
const getAmounts = document.querySelectorAll('.amount');
const getSpentAmount = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you cant get the value of that element, just querySelector works fine
const getRemainingAmount = document.querySelectorAll('.remaining-amount');

// console.log(getAmountInputValue);
// console.log(getAmounts);
// console.log(getSpentAmount);
// console.log(getRemainingAmount);

budgetAllocation();

function budgetAllocation(){
    const numberCasting = Number(getOriginalAmount);

    const needs = numberCasting * 0.5;
    const wants = numberCasting * 0.3;
    const saving = numberCasting * 0.2;

    const arrayOfAmounts = [needs, wants, saving];

    getAmounts.forEach((getAmount, index) => {
        let amountIndex = arrayOfAmounts[index];
        let spentAmountValue = getSpentAmount[index].value;
        let remainingAmount = getRemainingAmount[index];

        getAmount.innerHTML = amountIndex; //placing amount to respective p tag
        getAmount.style.fontFamily = 'Times New Roman';
        
        remainingAmount.value = amountIndex - spentAmountValue;
        
        
        const strArrayOfAmounts = String(amountIndex);
        const strSpentAmountValue = String(spentAmountValue);
        const strRemainingAmount = String(remainingAmount.value);

        const amountArray = [strArrayOfAmounts, strSpentAmountValue, strRemainingAmount];
        // console.log(amountArray);
        let repeat = 0;
        let arr = [];
        for(value of amountArray[repeat]){
            arr.push(value);
        }
        console.log(arr);
        arr.reverse();
        let str = '';
        let count = 0;
        for(let i = 0; i < arr.length; i++){
            str+= arr[i];
            count++;
            if(count % 3 === 0){
                str+= ',';
            }
        }

        const reversed = str.split('').reverse().join('');

        let newarr = [];
        for(nums of reversed){
            newarr.push(nums);
        }
        
        if(newarr.length === 8){
            newarr.shift();
        }

        const array = newarr.join('');
        console.log(array);

        getAmount.innerHTML = array;

    });


}


// need = '0123456';
// let arr = [];
// for(num of need){
//     arr.push(num);
// }

// arr.reverse();
// let str = '';
// let count = 0;
// for(let i = 0; i < arr.length; i++){
//     str+= arr[i];
//     count++;
//     if(count % 3 === 0){
//         str+= ',';
//     }
// }

// const reversed = str.split('').reverse().join('');
// console.log(reversed);