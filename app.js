
var DOMstrings = {
    budgetType: '.add__type',
    budgetDescription: '.add__description',
    budgetValue: '.add__value',
    addBudget: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    incomeDisplay: '.budget__income--value',
    expenseDisplay: '.budget__expenses--value',
    expensePercentageDisplay: '.budget__expenses--percentage',
    totalBudget: '.budget__value',
    listContainer: '.container',
    expensePercentages: '.item__percentage'
};

var budgetController = (function(){

    var data = {
        allLineItems: {
            incomes: [],
            expenses: []
        },
        totals:{
            incomes: 0,
            expenses: 0
        },
        budget: 0,
        percentage: -1
    }

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var addLineItem = function(type, description, value){
        var newLineItem, id;
        if(type == 'inc'){
            if(data.allLineItems.incomes.length == 0){
                id = 0
            }
            else{
                id = data.allLineItems.incomes[data.allLineItems.incomes.length -1].id + 1;
            }
            newLineItem = new Income(id, description, value);
            data.allLineItems.incomes.push(newLineItem);
        }
        else{
            if(data.allLineItems.expenses.length == 0){
                id = 0
            }
            else{
                id = data.allLineItems.expenses[data.allLineItems.incomes.length -1].id + 1;
            }
            newLineItem = new Expense(id, description, value);
            data.allLineItems.expenses.push(newLineItem);
        }
        return newLineItem
    }
    
    var deleteLineItem = function(type, id){
        var newIDArray, index;
        newIDArray = data.allLineItems[type].map(function(current){
            return current.id
        });
        index = newIDArray.indexOf(id); 
        if(index !== -1){
            data.allLineItems[type].splice(index, 1)
        }
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allLineItems[type].forEach(function(cur){
            sum += cur.value;
        })
        data.totals[type] = sum;
    }

    var calculateBudget = function(){
        calculateTotal('incomes')
        calculateTotal('expenses')
        data.budget = data.totals.incomes - data.totals.expenses;
        if(data.totals.incomes > 0){
            data.percentage = Math.round((data.totals.expenses / data.totals.incomes) * 100);
        }
        else{
            data.percentage = -1;
        }
    };

    var calcultePercentage = function(){
        data.allLineItems.expenses.forEach(function(current){
            current.calcPercentage(data.totals.incomes);
        })
    }

    var getPercentage = function(){
        var percentageArr;
        percentageArr = data.allLineItems.expenses.map(function(curr){
            return curr.getPercentage()
        })
        return percentageArr
    }

    var getBudget = function(){
        return{
            budget: data.budget,
            totalIncome: data.totals.incomes,
            totalExpenses: data.totals.expenses,
            percentage: data.percentage
        }
    }

    return{
        addLineItem: addLineItem,
        calculateBudget: calculateBudget,
        getBudget: getBudget,
        deleteLineItem: deleteLineItem,
        calcultePercentage: calcultePercentage,
        getPercentage: getPercentage
    }

})();

var uiController = (function(){

    var getInputFieldData = function(){
        return {
            budgetType: document.querySelector(DOMstrings.budgetType).value,
            budgetDescription: document.querySelector(DOMstrings.budgetDescription).value,
            budgetValue: parseFloat(document.querySelector(DOMstrings.budgetValue).value)
        } 
    }

    var addListItem = function(object, type){
        var html,newHtml,element;

        if(type == 'inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="incomes-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else if(type == 'exp'){
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expenses-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHtml = html.replace('%id%', object.id);
        newHtml = newHtml.replace('%description%', object.description);
        newHtml = newHtml.replace('%value%', formatNumber(object.value, type));

        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    }

    var deleteLineItem = function(selectorId){
        var element = document.getElementById(selectorId);
        element.parentNode.removeChild(element)
    }

    var displayPercentage = function(percentageArr){
        var fields = document.querySelectorAll(DOMstrings.expensePercentages)
        var nodeListForEach = function(list, callback){
            for(i = 0; i < list.length; i++){
                callback(list[i], i)
            }
        }
        nodeListForEach(fields, function(curr, index){
            if(percentageArr[index] > 0){
                curr.textContent = percentageArr[index] + ' %';
            }
            else{
                curr.textContent = '---'
            }
        })
    }

    var clearFields = function(){
        var fields, fieldsArray;

        fields = document.querySelectorAll(DOMstrings.budgetDescription + ', ' + DOMstrings.budgetValue);
        fieldsArray = Array.prototype.slice.call(fields);
        fieldsArray.forEach(function(currentValue, i, arr){
            currentValue.value = '';
        })
        fieldsArray[0].focus;
    }

    var displayBudget = function(object){
        if(object.budget >= 0){
            document.querySelector(DOMstrings.totalBudget).textContent = formatNumber(object.budget, 'inc');
        }
        else{
            document.querySelector(DOMstrings.totalBudget).textContent =  formatNumber(object.budget, 'exp');
        }
        document.querySelector(DOMstrings.incomeDisplay).textContent = formatNumber(object.totalIncome, 'inc');
        document.querySelector(DOMstrings.expenseDisplay).textContent = formatNumber(object.totalExpenses, 'exp');
        if(object.percentage > 0){
            document.querySelector(DOMstrings.expensePercentageDisplay).textContent = object.percentage + ' %';
        }
        else{
            document.querySelector(DOMstrings.expensePercentageDisplay).textContent =  '---';
        }
    }

    var formatNumber = function(num, type){
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type == 'exp' ? '- ': '+ ') + int + '.' + dec;

    }

    return{
        getInputFieldData: getInputFieldData,
        addListItem: addListItem,
        clearFields: clearFields,
        displayBudget: displayBudget,
        deleteLineItem: deleteLineItem,
        displayPercentage: displayPercentage
    }

})();

var appController = (function(budgetCntlr, uiCntlr){

    var setUpEventListeners = function(){
        document.querySelector(DOMstrings.addBudget).addEventListener('click', controllerAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode == 13){
                controllerAddItem();
            }
        });
        document.querySelector(DOMstrings.listContainer).addEventListener('click', controllerDeleteItem);
    }

    var updateBudget = function(){
        budgetCntlr.calculateBudget();
        var budget = budgetCntlr.getBudget();
        uiCntlr.displayBudget(budget);
    };

    var updatePercentage = function(){
        budgetCntlr.calcultePercentage()
        var percentages = budgetCntlr.getPercentage()
        console.log(percentages);
        uiCntlr.displayPercentage(percentages);
    };
    
    var controllerAddItem = function(){
        var addedItem, newLineItem;
        addedItem = uiCntlr.getInputFieldData();

        if(addedItem.budgetDescription != '' && !isNaN(addedItem.budgetValue) && addedItem.budgetValue >  0){

            newLineItem = budgetCntlr.addLineItem(addedItem.budgetType, addedItem.budgetDescription, addedItem.budgetValue);
            uiCntlr.addListItem(newLineItem, addedItem.budgetType)
            uiCntlr.clearFields();
            updateBudget();
            updatePercentage();
        }

    }

    var controllerDeleteItem = function(event){
        var lineItemId, splitID, type, id;
        lineItemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(lineItemId){
            splitID = lineItemId.split('-')
            type = splitID[0]
            id = parseInt(splitID[1]);
        }
        budgetCntlr.deleteLineItem(type, id)
        uiCntlr.deleteLineItem(lineItemId);
        updateBudget();
        updatePercentage();
    }

    return{
        setUpEventListeners: setUpEventListeners
    }

})(budgetController, uiController);

var init = (function(uiCntlr){
    appController.setUpEventListeners();
    uiCntlr.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        percentage: -1
    })
})(uiController);