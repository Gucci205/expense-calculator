# Expense Calculator

A personal budgeting tool built with HTML, CSS, and vanilla JavaScriptt. It divides a budget into Needs, Wants, and Savings using the 50/30/20 rule.

## Why I Built This

I originally built this project for myself.

Instead of creating a traditional expense tracker with many categories and features, I wanted something simple that matches how I prefer to manage my budget.

The budget is divided into three main allocations:

- **50% — Needs**
- **30% — Wants**
- **20% — Savings**

## Features

- Automatically allocates 50% to Needs, 30% to Wants, and 20% to Savings
- Records multiple expenses in each category
- Calculates each category’s remaining amount, total spent, and total remaining
- Allows confirmed amounts and the original budget to be edited
- Formats displayed amounts using German-style grouping, such as `1.220.000`
- Saves confirmed budget and expense data in the browser’s local storage
- Provides a responsive layout with a mobile footer animation

## How to Use

1. Enter the original budget using digits only, such as `15000000`, then confirm it.
2. The application calculates the 50/30/20 allocations.
3. Enter an expense under Needs, Wants, or Savings, then confirm it.
4. The expense is locked and the budget information is updated.
5. Select **Add Expense** to record more expenses in a category.
6. To edit a confirmed amount, select its check icon, change the value, and confirm it again.
7. To change the original budget, unlock it, enter the new amount, and confirm it. The category allocations and remaining amounts are recalculated.

## Amount Format

The current version accepts whole numbers made of digits only. Do not enter periods, commas, spaces, or decimal amounts. For example, enter `1220` rather than `1.220` or `1220,49`.

Amounts are formatted for display after confirmation. German decimal input such as `1220,49` is not supported.

## Saving Data

The app stores the confirmed budget and expenses in the browser’s local storage. This data belongs to the current browser profile and is not synced to another device or account.

**Known issue:** A saved budget may fail to restore after reload when any category has no expenses. This is being addressed.

## Running the Project

Open `index.html` in a modern browser. No build step is included. Bootstrap, Font Awesome, and the Cormorant Garamond font are loaded from external CDNs, so an internet connection is needed for those resources.

## Built With

- HTML
- CSS
- JavaScript
- Bootstrap
- Font Awesome
- Google Fonts


## Planned Improvements

- Save budget data between sessions  [done] 
- Better input validation  [done] 
- Spending limit warnings  [done] 
- Additional UX improvements  [done] 
- General code cleanup and refactoring  [done] 

## What I'm Learning

This project has helped me practice and better understand:

- DOM manipulation
- Event handling
- Dynamic element creation
- Array methods and calculations
- Function responsibilities
- Managing UI state
- Structuring a growing vanilla JavaScript application

## Project Status

🚧 **Work in Progress**

This project is designed around a simple personal budgeting workflow and is also used to practice JavaScript, DOM manipulation, event handling, data storage, and UI updates.