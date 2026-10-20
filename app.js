const originalAmountInput  = document.querySelector('.original-amount');
const originalAmountCircle = document.getElementById('first-circle');

const amountElements  = document.querySelectorAll('.amount');

const spentInputs  = document.querySelectorAll('.spent-amount');
const remainingInputs  = document.querySelectorAll('.remaining-amount');

const expenseLists = document.querySelectorAll('.expense-list');
const addExpenseButton = document.querySelectorAll('.add-expense-button');

const totalSpentInput = document.querySelector('.total-spent');
const totalRemainingInput = document.querySelector('.total-remaining');

const footer = document.querySelector('footer');

const mobileViewport = window.matchMedia('(max-width: 390px)');

let allocations = [];
loadData();

document.body.addEventListener('click', (e) => {
    const icon = e.target.closest("i");
    
    if(!icon) return;

    const isCircleIcon = icon.classList.contains('circle') || icon.classList.contains('fa-circle-check');

    if(isCircleIcon && !icon.hasAttribute('id')) makeInputDisabled(icon);
})

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

function parseNumericInput(input) {
    // Regular expression:
    // ^         -> Start of the string
    // (0|[1-9]\d*) -> Matches exactly 0, or any number starting with 1-9 followed by digits (prevents "05")
    // $         -> End of the string (ensures no trailing letters, dots, or garbage)
    const numericRegex = /^(0|[1-9]\d*)$/;
    
    // Strict evaluation against the raw input
    if (!numericRegex.test(input)) {
        alert("Validation rejected: Value must be a clean whole number. No decimals, commas, spaces, or formatting allowed.");
        throw new Error("Validation rejected: Value must be a clean whole number. No decimals, commas, spaces, or formatting allowed.");
    }
    
    // Parse cleanly into a standard JavaScript base-10 integer
    return parseInt(input, 10);
}

originalAmountCircle.addEventListener('click', (e) => {
    const siblingInput = originalAmountInput;
    const icon = e.currentTarget;
    const sections = document.querySelectorAll('section');

    if(icon.classList.contains('fa-circle-check')){
        siblingInput.disabled = false,
        siblingInput.value = siblingInput.value.replaceAll('.', '');
        
        icon.classList.remove('fa-solid', 'fa-circle-check');
        icon.classList.add('fa-regular', 'fa-circle');
        siblingInput.focus();

        return;
    }
    
    if(parseNumericInput(siblingInput.value)){
        const originalAmount = parseNumericInput(siblingInput.value);
        
        if(originalBudget.amount !== originalAmount){
            originalBudget.amount = originalAmount;
            siblingInput.value = originalAmount.toLocaleString('de-DE');
            siblingInput.disabled = true;
            icon.classList.remove('fa-regular', 'fa-circle');
            icon.classList.add('fa-solid', 'fa-circle-check');

            calculations();
            saveData();

            sections.forEach(section => {
                updateSection(section);
            })
        }else{
            siblingInput.disabled = true;
            originalBudget.amount = originalAmount;
    
            calculations();
            saveData();
    
            siblingInput.value = originalAmount.toLocaleString('de-DE');
            icon.classList.remove('fa-regular', 'fa-circle');
            icon.classList.add('fa-solid', 'fa-circle-check');
    
            updateTotal();
        }
    }
})

function calculations(){
    const originalAmount = Number(String(originalAmountInput.value).replaceAll('.', ''));
    allocations = calculateAllocations(originalAmount);

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
        amountElements[index].textContent = amount.toLocaleString('de-DE');
    })
}

function switchIcon(icon){
    icon.classList.remove('fa-regular', 'fa-circle', 'circle');
    icon.classList.add('fa-solid', 'fa-circle-check');
}

function makeInputDisabled(icon){
    const siblingInput = icon.previousElementSibling;
    const section = icon.closest("section");   //closest() only finds the ancestor
    console.log(section);

    if(icon.classList.contains('fa-circle-check')){
        siblingInput.disabled = false,
        siblingInput.value = siblingInput.value.replaceAll('.', '');

        icon.classList.remove('fa-solid', 'fa-circle-check');
        icon.classList.add('fa-regular', 'fa-circle', 'circle');
        siblingInput.focus();

        return;
    }
    
    if(parseNumericInput(siblingInput.value)){
        siblingInput.disabled = true;
        switchIcon(icon);
        updateSection(section);
    }else{
        siblingInput.disabled = false;
    }
}

function updateSection(section){
    const spentInputs = section.querySelectorAll("input.spent-amount");  //to find a descendants inside a section
    const remainingInput = section.querySelector("input.remaining-amount");
    const sectionName = section.className;
    let dataUpdated = false;
    
    const category = data.find(cate => cate.category === sectionName);

    spentInputs.forEach(input => {
        if (!input.disabled) return;

        const amount = Number(String(input.value).replaceAll('.', ''));
        const expenseIndex = input.dataset.expenseIndex;

        if (expenseIndex === undefined) {
            // First confirmation: add it and remember its position.
            input.dataset.expenseIndex = String(category.expense.length);
            category.expense.push(amount);
        } else {
            // Later confirmation: update that same expense.
            category.expense[Number(expenseIndex)] = amount;
        }

        input.value = amount.toLocaleString('de-DE');
        dataUpdated = true;
    })

    updateRemainingDisplay(category, remainingInput);
    if(dataUpdated) saveData();
    updateTotal();
}

function saveData(){
    const savedData = {
        budget: originalBudget.amount,
        data: data.map(cate => {
            return {
                category: cate.category,
                expense: cate.expense
            }
        })
    };

    localStorage.setItem("expenseCalculator", JSON.stringify(savedData));
}

function loadData(){
    try{
        const getData = JSON.parse(localStorage.getItem('expenseCalculator'));
        const isValid = getData !== null &&
                        typeof getData === 'object' &&
                        !Array.isArray(getData) &&
                        Number.isFinite(getData.budget) &&
                        getData.budget >= 0

        if(!isValid) return ;
        
        originalBudget.amount = getData.budget;
        
        const saveCategories = getData.data;

        const allCategoriesValid = 
            Array.isArray(saveCategories) &&
            saveCategories.length === data.length &&
            saveCategories.every((cate, index) => 
                cate &&
                cate.category === data[index].category &&
                Array.isArray(cate.expense) &&
                cate.expense.every(value =>
                    Number.isFinite(value) && value >= 0
                )
            );

        if (!allCategoriesValid) {
            console.warn("Saved data is invalid. Starting with an empty budget.");
            return;
        }

        saveCategories.forEach((cate, index) => {
            data[index].expense = cate.expense;
        })

        if(originalBudget.amount > 0){
            originalAmountInput.value = originalBudget.amount.toLocaleString('de-DE');
            originalAmountInput.disabled = true;
            calculations();
            const icon = originalAmountInput.nextElementSibling;
            
            icon.classList.remove('fa-regular', 'fa-circle');
            icon.classList.add('fa-solid', 'fa-circle-check');
        }

        data.forEach((cate) => {
            const section = document.querySelector(`section.${cate.category}`);
            const expenseList = section.querySelector('.expense-list');
            const existingBoxes = expenseList.querySelectorAll('.input-box');
            const remainingInput = section.querySelector('.remaining-amount');
            const expenseArray = Array.isArray(cate.expense) ? cate.expense : [];

            existingBoxes.forEach(box => {
                const input = box.querySelector('.spent-amount');
                if (input && input.value.trim() === '') box.remove(); 
            });
            
            expenseArray.forEach((amount, index) => {
                const inputBox = document.createElement('div');
                inputBox.className = 'input-box';
                inputBox.style.margin = '8px 0 0 0';

                const input = document.createElement('input');
                input.type = "text";
                input.className = "spent-amount";
                input.classList.add('rounded-3', 'outline-0', 'fs-5');
                input.placeholder = '0';

                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-circle-check';

                if( amount !== null && 
                    Number.isFinite(amount) &&
                    amount > 0 )
                {
                    input.value = amount.toLocaleString('de-DE');
                    input.disabled = true;
                    input.dataset.expenseIndex = String(index);
                }
                
                inputBox.append(input, icon);
                expenseList.append(inputBox);
                
                expenseList.scrollTop = expenseList.scrollHeight;

                if(expenseList.clientHeight >= 148){
                    const inputs = expenseList.querySelectorAll('input.spent-amount');
                    inputs.forEach(input => input.style.width = '96%');
                }      
            })

            if(Array.isArray(cate.expense) && !cate.expense.length){
                const html = `<div class="input-box">
                                    <input type="text" value="" placeholder="0" class="rounded-3 outline-0 fs-5 spent-amount" />
                                    <i class="fa-regular fa-circle circle"></i>
                                </div>`;

                expenseList.innerHTML = html;
            }
            updateRemainingDisplay(cate, remainingInput);
        })
        updateTotal();
    }catch(error){
        console.error('Unable to restore expense calculator data.', error);
    }
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
            input.placeholder = '0';

            inputBox.style.margin = '8px 0 0 0';
            inputBox.append(input);
            inputBox.insertAdjacentHTML('beforeend', '<i class="fa-regular fa-circle circle"></i>');

            expenseLists[index].append(inputBox);
            expenseLists[index].scrollTop = expenseLists[index].scrollHeight;
            input.focus();

            const expenseList = button.previousElementSibling;
            if(expenseList.clientHeight >= 148){
                const inputs = expenseList.querySelectorAll('input.spent-amount');
                inputs.forEach(input => input.style.width = '96%');
            }
        })
    })
}

function updateTotal(){
    let totalSpent = 0;
    let totalRemaining = 0;
    
    for(const cate of data){
        const spentAmount = cate.expense.reduce((sum, amount) => sum += amount, 0);
        totalSpent += spentAmount;

        if(cate.remaining === 0 && cate.expense.length > 0) continue;
        
        totalRemaining += cate.remaining === 0 ? cate.allocation : cate.remaining;
    }
    
    totalSpentInput.textContent = totalSpent.toLocaleString('de-DE');
    totalRemainingInput.textContent = totalRemaining.toLocaleString('de-DE');
}

function updateRemainingDisplay(category, remainingInput){
    const totalSpentPerSection = category
        ? category.expense.reduce((sum, amount) => sum + amount, 0)
        : 0;
    const remaining = category.allocation - totalSpentPerSection;
    category.remaining = remaining;
    
    remainingInput.value = category.remaining.toLocaleString('de-DE');   // Using toLocaleString() with a German Locale (de-DE) makes '.' as a thousands seperator

    alertOverBudget(remaining, remainingInput);
}

function alertOverBudget(remaining, remainingInput){
    if(remaining < 0){
        remainingInput.style.background = 'linear-gradient(135deg, #dd8c96, #eb507c';
        remainingInput.style.color = 'var(--bg-page)';
    }else{
        remainingInput.style.background = 'none';
        remainingInput.style.color = 'var(--primary-deep)';
        remainingInput.style.backgroundColor = '#fde2ec';
    }
}
