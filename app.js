
var DOMstrings = {
    budgetType: '.add__type',
    budgetDescription: '.add__description',
    budgetValue: '.add__value',
    addBudget: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
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
        data.percentage = Math.round((data.totals.expenses / data.totals.incomes) * 100);
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
        getBudget: getBudget
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
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else if(type == 'exp'){
            element = DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        newHtml = html.replace('%id%', object.id);
        newHtml = newHtml.replace('%description%', object.description);
        newHtml = newHtml.replace('%value%', object.value);

        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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

    return{
        getInputFieldData: getInputFieldData,
        addListItem: addListItem,
        clearFields: clearFields
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
    }

    var updateBudget = function(){
        budgetCntlr.calculateBudget();
        var budget = budgetCntlr.getBudget();
    };
    
    var controllerAddItem = function(){
        var addedItem, newLineItem;
        addedItem = uiCntlr.getInputFieldData();
        if(addedItem.budgetDescription != '' && !isNaN(addedItem.budgetValue) && addedItem.budgetValue >  0){

            newLineItem = budgetCntlr.addLineItem(addedItem.budgetType, addedItem.budgetDescription, addedItem.budgetValue);
            uiCntlr.addListItem(newLineItem, addedItem.budgetType)
            uiCntlr.clearFields();
            updateBudget();

        }

    }



    return{
        setUpEventListeners: setUpEventListeners
    }

})(budgetController, uiController);

var init = (function(){
    appController.setUpEventListeners();
})();