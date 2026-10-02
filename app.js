/*
Expense Calculator - Current Version Notes
----------------------------------------
Status is based on the current code in this file only, not a full runtime test.

Made / updated here:
- Footer scroll animation and mobile-only trigger: Works: Yes. It adds/removes the scrolling class based on scroll position and viewport width.
- Original budget lock/unlock behavior with the circle icon: Works: Mostly. It disables the input when a value exists and recalculates the allocations.
- Budget allocation calculation (50% / 30% / 20% split): Works: Yes, using Math.ceil() for each percentage.
- Allocation display for each category: Works: Yes. It updates the text content for each amount box and styles it.
- Per-section expense input locking and remaining balance update: Works: Partially. It updates section values and remaining amounts, but depends on section matching and disabled inputs.
- Add new expense input box button: Works: Yes. It creates a new input field within the selected expense list.
- Local storage saving for original budget and category expenses: Works: Partially. It saves structured data, but some values and category data are not fully synchronized across all logic paths.
- Formatting with commas in amounts: Works: Yes. The addCommas() helper formats values for display.
- Total spent / total remaining display area: Works: Not yet fully working. updateBudgetDisplay() is present but currently commented out and not consistently connected to the live calculations.
- Future totals logic placeholder: Works: Not implemented yet. updateTotals() is still a placeholder comment.
- Overall project status: Several features are added and partly working, but some parts are still unfinished or need cleanup, especially totals, persistence consistency, and section state handling.

In progress / still being worked on:
- Section-by-section expense tracking and remaining balance logic.
- Total spent and total remaining calculations.
- Local storage consistency for all category values.
- Cleaning up repeated logic and making calculations more reliable.
- Fixing input state handling when locking/unlocking fields.

Not working yet:
- Total spent / total remaining display is not fully connected to live calculations.
- Some local storage updates do not stay consistent with the current category values.
- Section data can behave unpredictably when inputs are re-enabled or updated.
- Some calculations still depend on fragile input state checks.
*/

const originalAmountInput  = document.querySelector('.original-amount');
const originalAmountCircle = document.querySelector('.first-circle');

const amountElements  = document.querySelectorAll('.amount');
const spentInputs  = document.querySelectorAll('.spent-amount');   //when calling an element with querySelectorAll, you can't get the value of that element, just querySelector works fine
const remainingInputs  = document.querySelectorAll('.remaining-amount');
const addExpenseButton = document.querySelectorAll('.add-expense-button');
const expenseLists = document.querySelectorAll('.expense-list');
const circleIcons = document.querySelectorAll('i.circle');

const totalSpentElement = document.querySelector('.total-spent');
const totalRemainingElement = document.querySelector('.total-remaining');

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

// updateBudgetDisplay();

let allocations = [];
calculations();

// originalAmountCircle.addEventListener('click', (e) => {
//     const siblingInput = e.target.previousElementSibling;

//     if(siblingInput.value && siblingInput.value !== "0"){
//         siblingInput.disabled = true;
//         calculations();
//         siblingInput.value = addCommas(siblingInput.value);
//     }else{
//         siblingInput.disabled = false;
//     }
// })

addNewInput();

function calculateAllocations(total){
    return [
        Math.ceil(total * 0.5),
        Math.ceil(total * 0.3),
        Math.ceil(total * 0.2)
    ];
}

function calculations(){
    const originalAmount = Number(originalAmountInput.value);

    console.log(originalAmount);

    allocations = calculateAllocations(originalAmount);

    const orginalCategory = data.find(cate => cate.category === 'original-amount');
    orginalCategory.originalAmount = originalAmount;

    saveData(orginalCategory);
    budgetAllocation(allocations);
    makeInputDisabled(allocations);
}

function budgetAllocation(allocations){
    allocations.forEach((amount, index) => {
        amountElements[index].textContent = amount.toLocaleString();
        amountElements[index].style.fontFamily = 'Times New Roman';
    })
}

function makeInputDisabled(allocations){
    circleIcons.forEach((icon) => {
        icon.addEventListener('click', (e) => {
            const targetElement = e.target;
            const siblingInput = targetElement.previousElementSibling;
            const section = targetElement.closest("section");   //closest() only finds the ancestor
            let allocation = '';

            siblingInput.value && siblingInput.value !== "0" ? siblingInput.disabled = true : siblingInput.disabled = false;

            sections.forEach((sec, index) => {
                if(sec.className === section.className) allocation = allocations[index];
            })

            updateSection(section, allocation);
        })
    })
}

function updateSection(section, allocation){
    const spentInputs = section.querySelectorAll("input.spent-amount");  //to find a descendants inside a section
    const remainingInput = section.querySelector("input.remaining-amount");
    const sectionName = section.className;

    let spentAmount = '';
    
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
            console.log(spentAmount);
            input.value = addCommas(spentAmount);

            data.forEach(cate => {
                if(cate.category === sectionName){
                    if(typeof spentAmount !== 'string'){
                        cate.expense.push(spentAmount);
                        saveData();
                    }
                }
            });
        }
    })
    
    const needCategory = data.find(cate => cate.category === sectionName);
    const result = needCategory
        ? needCategory.expense.reduce((sum, amount) => sum + amount, 0)
        : 0;
    const remaining = allocation - result;
    
    remainingInput.value = addCommas(remaining);
    needCategory.remaining = remaining;
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

function saveData(orginalCategory){
    
    const saveData = {
        // budget: Number(originalAmountInput.value),
        budget: orginalCategory.originalAmount,
        data: data.map(cate => {
            return {
                category: cate.category,
                expense: cate.expense
            }
        })
    };

    localStorage.setItem("expenseCalculator", JSON.stringify(saveData));
}


// function toNumber(value){
//     const number = Number(value.replace(/,/g, '')) || 0;
//     console.log(number);
// }

// function updateTotals(){
//     let totalSpent = 0;
//     let totalRemaining = 0;
// }

function updateBudgetDisplay(){
    makeInputDisabled();
    const originalAmount = Number(originalAmountInput.value);

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
            remainingInputs[index].style.background = 'linear-gradient(135deg, #dd8c96, #eb507c';
            remainingInputs[index].style.color = 'var(--bg-page)';

        }
    });
    // makeInputDisabled(spent);

    originalAmountInput.value = addCommas(originalAmount);
    totalSpentElement.textContent = addCommas(totalSpent);
    totalRemainingElement.textContent = addCommas(totalRemaining);
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

// A future updateTotals() will handle the global Total Spent / Total Remaining.

//save data 
// - original budget amount
// - Expenses for each category

// structure
// {
//     budget: 2501755,

//     data: [
//         {
//             category: "need",
//             expense: [100000, 50000]
//         },
//         {
//             category: "want",
//             expense: [30000]
//         },
//         {
//             category: "save",
//             expense: [10000]
//         }
//     ]
// }