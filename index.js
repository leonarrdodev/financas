//clear the form
function clearForm() {
    const container = document.getElementById('form');
    container.innerHTML = ''; // Remove todos os elementos filhos
}

//create the submit button
function createSubmitButton(contentButton){
    const submitButton = document.createElement('button')
    submitButton.textContent = contentButton 
    submitButton.setAttribute('type', 'submit')
    submitButton.classList.add('button-submit')
    return submitButton
}

//new form
function newForm(){
    //checks whether the selected option is already created
    if(document.querySelector('#newForm')) return

    //create the container 
    const newForm = document.createElement('div')
    newForm.setAttribute('id', 'newForm')
    return newForm
}

//standard form fields
function standardFormFields(){
    //name field
    const labelName = document.createElement('label')
    labelName.setAttribute('for', 'transaction-name')
    labelName.textContent = 'Nome da transação:'

    const inputName = document.createElement('input')
    inputName.setAttribute('id', 'transaction-name')

    //value field
    const labelValue = document.createElement('label')
    labelValue.setAttribute('for', 'transaction-value')
    labelValue.textContent = 'Valor:'

    const inputValue = document.createElement('input')
    inputValue.setAttribute('id', 'transaction-value')

    //transaction type field
    const labelTypeTransaction = document.createElement('label')
    labelTypeTransaction.setAttribute('for', 'transaction-type')
    labelTypeTransaction.textContent = 'Selecione o tipo de transação:'

    const selectTypeTransaction = document.createElement('select')
    selectTypeTransaction.setAttribute('id', 'transaction-type')

    const incomeOption = document.createElement('option')
    incomeOption.setAttribute('value', 'Ganho')
    incomeOption.textContent = 'Ganho'

    const expenseOption = document.createElement('option')
    expenseOption.setAttribute('value', 'Gasto')
    expenseOption.textContent = 'Gasto'

    selectTypeTransaction.append(incomeOption, expenseOption)

    

     return [
        labelName, inputName,
        labelValue, inputValue,
        labelTypeTransaction, selectTypeTransaction
    ]
}

//renders the form to create a new transaction
function renderNewTransactionForm(){
    //clean the container
    clearForm()

    const newFormElement = newForm()
    if (!newFormElement) return

    //create the title
    const title = document.createElement('h2')
    title.textContent = 'Nova transação'

    const formFields = standardFormFields()
    
    //button submit
    const submitButton = createSubmitButton('Salvar')
    submitButton.setAttribute('id', 'newTransaction')

    //add to DOM
    newFormElement.append(title, ...formFields, submitButton)
    document.querySelector('#form').append(newFormElement)


}

//event to add new transaction form
const newTransaction = document.querySelector('#newTransaction')
newTransaction.addEventListener('click', renderNewTransactionForm)

//form ID fields
function idFields(){
    const labelId = document.createElement('label')
    labelId.setAttribute('for', 'transaction-id')
    labelId.textContent = 'ID:'

    const inputId = document.createElement('input')
    inputId.setAttribute('id', 'transaction-id')

    return [labelId, inputId]
}

//renders the form to edit a transaction
function renderEditTransactionForm(){
    clearForm()

    const newFormElement = newForm()
    if (!newFormElement) return

    //create the title
    const title = document.createElement('h2')
    title.textContent = 'Editar transação'

    const idFieldElements = idFields()

    const formFields = standardFormFields()

    //button submit
    const submitButton = createSubmitButton('Editar')
    submitButton.setAttribute('id', 'editTransaction')

    newFormElement.append(title, ...idFieldElements, ...formFields, submitButton)
    document.querySelector('#form').append(newFormElement)
}

//event to add a transaction edit form
const editTransaction = document.querySelector('#editTransaction')
editTransaction.addEventListener('click', renderEditTransactionForm)


//renders the form to delete a transaction
function renderDeleteTransactionForm(){
    clearForm()

    const newFormElement = newForm()
    if (!newFormElement) return

    //create the title
    const title = document.createElement('h2')
    title.textContent = 'Deletar transação'

    const idFieldElements = idFields()

    //button submit
    const submitButton = createSubmitButton('Deletar')
    submitButton.setAttribute('id', 'deleteTransaction')

    newFormElement.append(title, ...idFieldElements, submitButton)
    document.querySelector('#form').append(newFormElement)

    
}
//event to add a form to delete a transaction
const deleteTransaction = document.querySelector('#deleteTransaction')
deleteTransaction.addEventListener('click', renderDeleteTransactionForm)


//renders the new transaction created on the page
function renderTransactions(transactionData){
    //div transaction
    const transaction = document.createElement('div')
    transaction.classList.add('transaction')
    transaction.id = `transaction-${transactionData.id}`

    //transaction name 
    const name = document.createElement('h3')
    name.classList.add('transaction-name')
    name.textContent = transactionData.name

    //transaction id
    const id = document.createElement('p')
    id.classList.add('transaction-id')
    id.textContent = `Id: ${transactionData.id}`

    //transaction value 
    const value = document.createElement('p')
    value.classList.add('transaction-value')
    value.textContent = `Valor ${Number(transactionData.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

    const type = document.createElement('p')
    type.classList.add('transaction-type')
    type.textContent = `Tipo de transação: ${transactionData.type}`

    //add the elements in the transactions div
    transaction.append(name, id, value, type)

    //add transaction in the page
    document.querySelector('#transactions-list').append(transaction)
}

//search for transactions in the database
async function fetchTransactions(){
    const transactions = await fetch('http://localhost:3000/transactions')
        .then(res => res.json())        

        transactions.forEach(renderTransactions)
}

//call the function to fetch transactions as soon as the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchTransactions()
})



//POST method to send new transactions
async function newTransactionHandler(){
    const value = parseFloat(document.querySelector('#transaction-value').value)
    if (isNaN(value) || value <= 0) {
        alert('Valor inválido!')
        return
    }

    const transactionData = {
        name: document.querySelector('#transaction-name').value,
        value: document.querySelector('#transaction-value').value,
        type: document.querySelector('#transaction-type').value
    }

    const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
    })

    const savedTransaction = await response.json()

    form.reset()

    renderTransactions(savedTransaction)
}

//PUT method to edit transactions
async function editTransactionHandler(id){
    const value = parseFloat(document.querySelector('#transaction-value').value)
    if (isNaN(value) || value <= 0) {
        alert('Valor inválido!')
        return
    }

    const transactionData = {
        id: document.querySelector('#transaction-id').value,
        name: document.querySelector('#transaction-name').value,
        value: document.querySelector('#transaction-value').value,
        type: document.querySelector('#transaction-type').value
    }
    
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
    })
    
   const savedTransaction = await response.json()

    form.reset()

    renderTransactions(savedTransaction)
}

//call the respective function for each of the submit
function handleFormSubmit(ev) {
    ev.preventDefault()

    const submitButton = ev.submitter
    const action = submitButton.id

    if (action === 'newTransaction') {
        newTransactionHandler()
    } else if (action === 'editTransaction') {
        editTransactionHandler(document.querySelector('#transaction-id').value)
    } else if (action === 'deleteTransaction') {
        deleteTransactionHandler()
    }
}

const form = document.querySelector('#form')
form.addEventListener('submit', handleFormSubmit)