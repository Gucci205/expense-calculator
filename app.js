const originalAmountInput  = document.querySelector('.original-amount');

const amountElements  = document.querySelectorAll('.amount');
const spentInputs  = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you can't get the value of that element, just querySelector works fine
const remainingInputs  = document.querySelectorAll('.remaining-amount');
const addExpenseButton = document.querySelectorAll('.add-expense-button');
const expenseLists = document.querySelectorAll('.expense-list');
const circleIcons = document.querySelectorAll('i.fa-regular');

const totalSpentElement = document.querySelector('.total-spent');
const totalRemainingElement = document.querySelector('.total-remaining');

updateBudgetDisplay();
// addNewInput();

function updateBudgetDisplay(){
    makeInputDisabled();
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
        
        spentInputs[index].value = spent.toLocaleString();      //display 0 automatically if there is no value
        remainingInputs[index].value = remaining.toLocaleString();
        
        // console.log(spent);

        if(remaining < 0){
            remainingInputs[index].style.color = 'maroon';
        }
    });
    // makeInputDisabled(spent);

    originalAmountInput.value = addCommas(originalAmount);
    totalSpentElement.textContent = addCommas(totalSpent);
    totalRemainingElement.textContent = addCommas(totalRemaining);
}

function calculateAllocations(total){
    return [
        Math.ceil(total * 0.5),
        Math.ceil(total * 0.3),
        Math.ceil(total * 0.2)
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
    addExpenseButton.forEach((button, index) => {
        button.addEventListener('click', () => {
            const createInputBox = document.createElement('div');
            createInputBox.className = 'input-box';

            const createInput = document.createElement('input');
            createInput.setAttribute('type', "text");
            createInput.setAttribute('value', "");
            createInput.className = "spent-amount";
            createInput.classList.add('rounded-3', 'outline-0', 'fs-5');

            createInputBox.innerHTML = `<i class="fa-regular fa-circle circle"></i>`;
            createInputBox.append(createInput);
            expenseLists[index].append(createInputBox);

            expenseLists[index].scrollTop = expenseLists[index].scrollHeight;

            // console.log(createInput);
            // console.log(creatInputBox);
        })
    })
}

function makeInputDisabled(){
    circleIcons.forEach((icon) => {
        icon.addEventListener('click', (event) => {
            const siblingInput = event.target.previousElementSibling;
            console.log(siblingInput.value);
            if(siblingInput.value && siblingInput.value !== "0"){
                siblingInput.disabled = true;
            }else{
                siblingInput.disabled = false;
            }
        })
    })
}