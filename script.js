let currentInput = '0';
let currentExpression = '';
let calculationHistory = [];


function clearDisplay() {
    currentInput = '0';
    currentExpression = '';
    updateDisplay();
}

function deleteLastDigit() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
    } else if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
    }
    updateDisplay();
}


function appendToExpression(value) {
    currentInput += value;
    updateDisplay();
}

function getOperator(op) {
    currentExpression += currentInput + op;
    currentInput = "";
    updateDisplay();
}

function getNumber(num) {
    if (currentInput === '0' || currentInput === '-0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function calculateResult() {
    if (currentExpression !== '' || currentInput !== '0') {
        currentExpression += currentInput;
        console.log(currentExpression);

        try {
            const result = customEval(currentExpression);
            currentInput = result.toString();
            // Save history
            const historyItem = {
                expression: currentExpression,
                result: result
            };
            calculationHistory.push(historyItem);
            saveHistoryToLocalStorage();
            currentExpression = ''; // Clear after saving history
        } catch (error) {
            currentInput = "Error";
            console.log(error.message)
            currentExpression = '';
        }

        updateDisplay();
    }
}

//Shunting Yard algorithm to convert the infix expression (standard mathematical notation) into postfix notation, and then evaluates the postfix expression.
function customEval(expression) { 
    const operatorsPriority = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2
    };

    const applyOperation = (operands, operator) => {
        const rightOperand = operands.pop();
        const leftOperand = operands.pop();

        switch (operator) {
            case '+':
                return leftOperand + rightOperand;
            case '-':
                return leftOperand - rightOperand;
            case '*':
                return leftOperand * rightOperand;
            case '%':
                return leftOperand % rightOperand;
            case '/':
                if (rightOperand !== 0) {
                    return leftOperand / rightOperand;
                } else {
                    throw new Error('/ by zero err');
                }
        }
    };

    const tokens = expression.split(/([\+\-\*\/\%])/g).filter(token => token.trim() !== ''); 
    console.log(tokens);
    const operands = [];
    const operators = [];

    tokens.forEach(token => {
        if (operatorsPriority[token]) {
            console.log(operands)
            while (
                operators.length > 0 &&
                operatorsPriority[operators[operators.length - 1]] >= operatorsPriority[token]
            ) {
                operands.push(applyOperation(operands, operators.pop()));
            }
            operators.push(token);
        } else {
            operands.push(parseFloat(token));
        }
    });

    while (operators.length > 0) {
        operands.push(applyOperation(operands, operators.pop()));
    }

    if (operands.length === 1) {
        console.log(operands)
        return operands[0];
    } 
   
}

/* KEYBOARD */ 

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const key = event.key;
    
    // Check if the pressed key is a number or operator
    if (!isNaN(key) || ['+', '-', '*', '/', '%', '.'].includes(key)) {
        handleKeyInput(key);
    } else {
        // Check for special keys
        switch (key) {
            case 'Enter':
                calculateResult();
                break;
            case 'Escape':
                clearDisplay();
                break;
            case 'Backspace':
                deleteLastDigit();
                break;
        }
    }
}

function handleKeyInput(key) {
    // Check if the key is a number
    if (!isNaN(key) || key === '.') {
        getNumber(key);
    } else {
        // Check if the key is an operator
        if (['+', '-', '*', '/', '%'].includes(key)) {
            getOperator(key);
        }
    }
}


function updateDisplay() {
    document.getElementById('inputbox').value = currentExpression + currentInput;
}

function saveHistoryToLocalStorage() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
}

