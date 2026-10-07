// Current features:
// - Splits the budget into Needs, Wants, and Savings using the 50/30/20 rule.
// - Supports multiple expenses per section and calculates section balances and overall totals.
// - Lets users confirm and unlock the budget and expense inputs.
// - Saves the budget and confirmed expenses to localStorage.
//
// Still to improve:
// - Restore saved budget and expense data from localStorage when the page loads.
// - Keep stored expenses and displayed totals consistent when editing a confirmed expense.
// - Add stronger input validation and simplify repeated event-handler logic.

const originalAmountInput  = document.querySelector('.original-amount');
const originalAmountCircle = document.querySelector('.first-circle');

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
function updateFooterAnimation(isPageLoad = false){
    // Keep the animation mobile-only and reset the class if the viewport becomes wider.
    if(!mobileViewport.matches){
        footer.classList.remove('is-scrolling');
        return; 
    }

    // Play on mobile page load, or after scrolling past the small distance threshold.
    footer.classList.toggle('is-scrolling', isPageLoad === true || window.scrollY > 8);
}

// Recheck the footer state on load, scroll, and viewport resize.
window.addEventListener('load', () => updateFooterAnimation(true));
window.addEventListener('scroll', updateFooterAnimation, { passive:true });
window.addEventListener('resize', updateFooterAnimation);

let allocations = [];

// calculations();
// updateBudgetDisplay();

originalAmountCircle.addEventListener('click', (e) => {
    const siblingInput = e.target.previousElementSibling;
    const icon = e.target;

    if(icon.classList.contains('check')){
        siblingInput.disabled = false,
        siblingInput.value = siblingInput.value.replaceAll(',', '');
        
        icon.classList.add('fa-regular', 'fa-circle', 'first-circle');
        icon.classList.remove('fa-solid', 'fa-circle-check', 'check');
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

        console.log(localStorage.getItem("expenseCalculator"));
    }else{
        siblingInput.disabled = false;
    }
    
})

function switchIcon(icon){
    icon.classList.remove('fa-regular', 'fa-circle', 'first-circle');
    icon.classList.add('fa-solid', 'fa-circle-check', 'check');
}

function calculateAllocations(total){
    return [
        total * 0.5,
        total * 0.3,
        total * 0.2
    ];
}

function calculations(){
    const originalAmount = Number(originalAmountInput.value);
    allocations = calculateAllocations(originalAmount);

    originalamount.amount = originalAmount;      //data.js

    budgetAllocation(allocations);
    makeInputDisabled(allocations);
}

function budgetAllocation(allocations){
    allocations.forEach((amount, index) => {
        data[index].allocation = amount;
        amountElements[index].textContent = amount.toLocaleString();
    })
}

function makeInputDisabled(allocations){
    circleIcons.forEach((icon) => {
        icon.addEventListener('click', (e) => {
            const targetElement = e.target;
            const siblingInput = targetElement.previousElementSibling;
            const section = targetElement.closest("section");   //closest() only finds the ancestor
            let allocation = '';

            if(icon.classList.contains('check')){
                siblingInput.disabled = false,
                siblingInput.value = siblingInput.value.replaceAll(',', '');

                const value = Number(siblingInput.value);
                
                icon.classList.add('fa-regular', 'fa-circle', 'first-circle');
                icon.classList.remove('fa-solid', 'fa-circle-check', 'check');
                siblingInput.focus();

                data.forEach(cate => {
                    cate.expense.forEach((amount, index) => {
                        if(amount === value) cate.expense.splice(index, 1);
                    })
                }) 

            //NEED TO FIX

                //when the amount updated and confirmed, it went to index[1] if it had 2 amount in expense.
                // [1044895, 10000] -> firt amount updated from 1044895 to 1000000
                // But in the data, it store as a second amount -> [10000, 1000000]
                
                return;
            }
            
            if(siblingInput.value && siblingInput.value !== "0"){
                siblingInput.disabled = true;
                switchIcon(targetElement);
                
                sections.forEach((sec, index) => {
                    if(sec.className === section.className) allocation = allocations[index];
                })
                
                updateSection(section, allocation);
            }else{
                siblingInput.disabled = false;
            }
        });
    })
}

function updateSection(section, allocation){
    const spentInputs = section.querySelectorAll("input.spent-amount");  //to find a descendants inside a section
    const remainingInput = section.querySelector("input.remaining-amount");
    const sectionName = section.className;

    let spentAmount = '';
    let dataUpdated = false;

    spentInputs.forEach(input => {
        if(!input.disabled) return;

        const result = Number(String(input.value).replaceAll(',', ''));

        const alreadyExists = data.some(cate =>
            cate.expense.some(amount => amount === result)
        );

        if(alreadyExists){
            input.value = addCommas(result);
        }else{
            spentAmount = Number(input.value);
            input.value = addCommas(spentAmount);

            data.forEach(cate => {
                if(cate.category === sectionName){
                    if(typeof spentAmount !== 'string'){
                        cate.expense.push(spentAmount);
                        dataUpdated = true;
                    }
                }
            });
        }
    })
    
    const category = data.find(cate => cate.category === sectionName);
    const totalSpentPerSection = category
        ? category.expense.reduce((sum, amount) => sum + amount, 0)
        : 0;

        console.log(allocation);    //allocation doesn't update when org amount updated.
    const remaining = allocation - totalSpentPerSection;

    if(remaining < 0){
        remainingInput.style.background = 'linear-gradient(135deg, #dd8c96, #eb507c';
        remainingInput.style.color = 'var(--bg-page)';
    }

    remainingInput.value = remaining.toLocaleString();
    category.remaining = remaining;

    if(dataUpdated) saveData();
    updateTotal();

    console.log(localStorage.getItem("expenseCalculator"));
    console.log(data);
}

function addCommas(value){
    const digits = String(value).split('').reverse();
    
    let result = '';
    let count = 0;
    
    for(let i = 0; i < digits.length; i++){
        result += digits[i];
        count++;
    // Add a comma every 3 digits, but only if there are still digits left to process
    if(count % 3 === 0 && i !== digits.length-1){
        result += ',';
        }
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
        })
    })
}

function updateTotal(){
    let totalSpent = 0;
    let totalRemaining = 0;
    
    data.forEach((cate) => {
        const spentAmount = cate.expense.reduce((acc, curr) => {
            acc += curr;
            return acc;
        }, 0);

        totalSpent += spentAmount;

        if(cate.remaining === 0){
            totalRemaining += cate.allocation;
        }else{
            totalRemaining += cate.remaining;
        }
    })
    
    totalSpentInput.textContent = totalSpent.toLocaleString();
    totalRemainingInput.textContent = totalRemaining.toLocaleString();
}

// function toNumber(value){
//     const number = Number(value.replace(/,/g, '')) || 0;
//     console.log(number);
// }


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