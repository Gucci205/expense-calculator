const getAmountInputValue = document.querySelector('.amountInput').value;
const getAmounts = document.querySelectorAll('.amount');
const getSpentAmount = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you cant get the value of that element, just querySelector works fine
const getRemainingAmount = document.querySelectorAll('.remaining-amount');

budgetAllocation();

function budgetAllocation(){
    const numberCasting = Number(getAmountInputValue);
    let needs = numberCasting * 0.5;
    // console.log(needs);
    const wants = numberCasting * 0.3;

    const saving = numberCasting * 0.2;

    const arrayOfAmounts = [needs, wants, saving];
    // console.log(arrayOfAmounts);

    getAmounts.forEach((getAmount, index) => {
        getAmount.innerHTML = arrayOfAmounts[index]; //placing amount to respective p tag
        getAmount.style.fontFamily = 'Times New Roman';
        
        // console.log(arrayOfAmounts[index] - getSpentAmount[index].value);

        getRemainingAmount[index].value = arrayOfAmounts[index] - getSpentAmount[index].value;
    });

    let need = String(needs);
    console.log(need);
    let arr = [];
    for(num of need){
        // console.log(num);
        arr.push(num);
    }
    arr.reverse();
    let str = '';
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        // console.log(arr[i]);
        str+= arr[i];
        count++;
        if(count % 3 === 0){
            str+= ',';
        }
    }
    console.log(arr);
    
    console.log(str);
}