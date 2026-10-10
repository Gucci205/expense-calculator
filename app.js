const originalAmountInput  = document.querySelector('.original-amount');
const originalAmountCircle = document.getElementById('first-circle');

const amountElements  = document.querySelectorAll('.amount');

const spentInputs  = document.querySelectorAll('.spent-amount');
const remainingInputs  = document.querySelectorAll('.remaining-amount');
const circleIcons = document.querySelectorAll('i.circle');

const expenseLists = document.querySelectorAll('.expense-list');
const addExpenseButton = document.querySelectorAll('.add-expense-button');

const totalSpentInput = document.querySelector('.total-spent');
const totalRemainingInput = document.querySelector('.total-remaining');

const footer = document.querySelector('footer');

const mobileViewport = window.matchMedia('(max-width: 384px)');
const sections = document.querySelectorAll('section');


// Add the class that tells CSS to play the footer's return animation while scrolling.
function updateFooterAnimation(){
    // Keep the animation mobile-only and reset the class if the viewport becomes wider.
    if(!mobileViewport.matches){
        footer.classList.remove('is-scrolling');
        return; 
    }

    // A small scroll distance prevents the animation from triggering immediately on load.
    footer.classList.toggle('is-scrolling', window.scrollY > 8);
}

// Recheck the footer state whenever the page scrolls or the viewport is resized.
window.addEventListener('scroll', updateFooterAnimation, { passive:true });
window.addEventListener('resize', updateFooterAnimation);

let allocations = [];

makeInputDisabled();
// updateBudgetDisplay();

originalAmountCircle.addEventListener('click', (e) => {
    let count = 0;
    const siblingInput = originalAmountInput;
    const icon = e.currentTarget;

    if(icon.classList.contains('fa-circle-check')){
        siblingInput.disabled = false,
        siblingInput.value = siblingInput.value.replaceAll(',', '');
        
        icon.classList.remove('fa-solid', 'fa-circle-check');
        icon.classList.add('fa-regular', 'fa-circle');
        siblingInput.focus();

        return;
    }
    
    if(siblingInput.value && siblingInput.value !== "0"){
        siblingInput.disabled = true;

        calculations();
        saveData();
        
        siblingInput.value = addCommas(siblingInput.value);
        switchIcon(icon);
        updateTotal();

        // console.log(localStorage.getItem("expenseCalculator"));
    }else{
        siblingInput.disabled = false;
    }
    
})

function calculations(){

    const originalAmount = Number(originalAmountInput.value);
    allocations = calculateAllocations(originalAmount);

    originalamount.amount = originalAmount;      //data.js

    budgetAllocation(allocations);
}

function calculateAllocations(total){

    return [
        total * 0.5,
        total * 0.3,
        total * 0.2
    ];
}

function budgetAllocation(allocations){

    allocations.forEach((amount, index) => {
        data[index].allocation = amount;
        amountElements[index].textContent = amount.toLocaleString();
    })
}

function switchIcon(icon){
    console.log('switchIcon run');

    icon.classList.remove('fa-regular', 'fa-circle', 'circle');
    icon.classList.add('fa-solid', 'fa-circle-check');

    console.log(icon.classList);
}

function makeInputDisabled(){

    circleIcons.forEach((icon) => {
        icon.addEventListener('click', (e) => {
            const targetElement = e.target;
            const siblingInput = targetElement.previousElementSibling;
            const section = targetElement.closest("section");   //closest() only finds the ancestor

            if(targetElement.classList.contains('fa-circle-check')){
                siblingInput.disabled = false,

                targetElement.classList.remove('fa-solid', 'fa-circle-check');
                targetElement.classList.add('fa-regular', 'fa-circle', 'circle');
                siblingInput.focus();

                return;
            }
            
            if(siblingInput.value && siblingInput.value !== "0"){
                siblingInput.disabled = true;
                switchIcon(targetElement);
                updateSection(section);
            }else{
                siblingInput.disabled = false;
            }
        });
    })
}

function updateSection(section){

    const spentInputs = section.querySelectorAll("input.spent-amount");  //to find a descendants inside a section
    const remainingInput = section.querySelector("input.remaining-amount");
    const sectionName = section.className;
    let dataUpdated = false;
    
    const category = data.find(cate => cate.category === sectionName);

    spentInputs.forEach(input => {
        if (!input.disabled) return;

        const amount = Number(String(input.value).replaceAll(',', ''));
        const expenseIndex = input.dataset.expenseIndex;

        if (expenseIndex === undefined) {
            // First confirmation: add it and remember its position.
            input.dataset.expenseIndex = String(category.expense.length);
            category.expense.push(amount);
        } else {
            // Later confirmation: update that same expense.
            category.expense[Number(expenseIndex)] = amount;
        }

        input.value = addCommas(amount);
        dataUpdated = true;
    })
    
    const totalSpentPerSection = category
        ? category.expense.reduce((sum, amount) => sum + amount, 0)
        : 0;

    const remaining = category.allocation - totalSpentPerSection;

    if(remaining < 0){
        remainingInput.style.background = 'linear-gradient(135deg, #dd8c96, #eb507c';
        remainingInput.style.color = 'var(--bg-page)';
    }else{
        remainingInput.style.background = 'none';
        remainingInput.style.color = 'var(--primary-deep)';
        remainingInput.style.backgroundColor = '#fde2ec';
    }

    remainingInput.value = remaining.toLocaleString();
    category.remaining = remaining;

    if(dataUpdated) saveData();
    updateTotal();

    // console.log(localStorage.getItem("expenseCalculator"));
    // console.log(data);
}

function addCommas(value){
    const digits = String(value).split('').reverse();
    
    let result = '';
    let count = 0;
    
    for(let i = 0; i < digits.length; i++){
        result += digits[i];
        count++;
    // Add a comma every 3 digits, but only if there are still digits left to process
        if(count % 3 === 0 && i !== digits.length-1) result += ',';
    }
    
    return result.split('').reverse().join('');
}

function saveData(){
    const savedData = {
        budget: Number(String(originalAmountInput.value).replaceAll(',', '')),
        data: data.map(cate => {
            return {
                category: cate.category,
                expense: cate.expense
            }
        })
    };

    localStorage.setItem("expenseCalculator", JSON.stringify(savedData));
}

addNewInput();
function addNewInput(){
    addExpenseButton.forEach((button, index) => {
        button.addEventListener('click', () => {
            const inputBox = document.createElement('div');
            inputBox.className = 'input-box';

            const input = document.createElement('input');
            input.setAttribute('type', "text");
            input.setAttribute('value', "");
            input.className = "spent-amount";
            input.classList.add('rounded-3', 'outline-0', 'fs-5');
            inputBox.style.margin = '10px 0 0 0';
            inputBox.innerHTML = `<i class="fa-regular fa-circle circle"></i>`;
            inputBox.append(input);
            expenseLists[index].append(inputBox);

            expenseLists[index].scrollTop = expenseLists[index].scrollHeight;
        })
    })
}

function updateTotal(){
    let totalSpent = 0;
    let totalRemaining = 0;
    
    for(cate of data){
        const spentAmount = cate.expense.reduce((sum, amount) => sum += amount, 0);

        totalSpent += spentAmount;

        if(cate.remaining === 0 &&cate.expense.length > 0) continue;

        totalRemaining += cate.remaining === 0 ? cate.allocation : cate.remaining;
    }
    
    totalSpentInput.textContent = totalSpent.toLocaleString();
    totalRemainingInput.textContent = totalRemaining.toLocaleString();
}

// function updateBudgetDisplay(){
//     makeInputDisabled();
//     const originalAmount = Number(originalAmountInput.value);

//     const allocations = calculateAllocations(originalAmount);

//     let totalSpent = 0;
//     let totalRemaining = 0;
    
//     allocations.forEach((amount, index) => {
//         const spent = Number(spentInputs[index].value);
//         const remaining = amount - spent;

        
//         totalSpent += spent;
//         totalRemaining += remaining;
        
//         amountElements[index].textContent = amount.toLocaleString();
//         amountElements[index].style.fontFamily = 'Times New Roman';
        
//         spentInputs[index].value = spent.toLocaleString();      //display 0 automatically if there is no value
//         remainingInputs[index].value = remaining.toLocaleString();
        
//         // console.log(spent);

//         if(remaining < 0){
//             remainingInputs[index].style.background = 'linear-gradient(135deg, #dd8c96, #eb507c';
//             remainingInputs[index].style.color = 'var(--bg-page)';

//         }
//     });
//     // makeInputDisabled(spent);

//     originalAmountInput.value = addCommas(originalAmount);
//     totalSpentInput.textContent = addCommas(totalSpent);
//     totalRemainingInput.textContent = addCommas(totalRemaining);
// }