
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
            income: 0,
            expense: 0
        }
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

    return{
        addLineItem: addLineItem
    }

})();

var uiController = (function(){

    var getInputFieldData = function(){
        return {
            budgetType: document.querySelector(DOMstrings.budgetType).value,
            budgetDescription: document.querySelector(DOMstrings.budgetDescription).value,
            budgetValue: document.querySelector(DOMstrings.budgetValue).value
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

    return{
        getInputFieldData: getInputFieldData,
        addListItem: addListItem
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

    
    var controllerAddItem = function(){
        var addedItem, newLineItem;
        addedItem = uiCntlr.getInputFieldData();
        newLineItem = budgetCntlr.addLineItem(addedItem.budgetType, addedItem.budgetDescription, addedItem.budgetValue);
        uiCntlr.addListItem(newLineItem, addedItem.budgetType)

        document.querySelector(DOMstrings.budgetDescription).value =  '';
        document.querySelector(DOMstrings.budgetValue).value =  '';
    }

    return{
        setUpEventListeners: setUpEventListeners
    }

})(budgetController, uiController);

var init = (function(){
    appController.setUpEventListeners();
})();