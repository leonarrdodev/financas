//limpa o formulario
function clearForm() {
    const container = document.getElementById('form');
    container.innerHTML = ''; // Remove todos os elementos filhos
}

//cria o botão de submit
function createSubmitButton(contentButton){
    const submitButton = document.createElement('button')
    submitButton.textContent = contentButton 
    submitButton.setAttribute('type', 'submit')
    submitButton.classList.add('button-submit')
    return submitButton
}

//novo formulario
function newForm(){
    //checks whether the selected option is already created
    if(document.querySelector('#newForm')) return

    //create the container 
    const newForm = document.createElement('div')
    newForm.setAttribute('id', 'newForm')
    return newForm
}

//campos padrões do formulario
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

//renderiza o formulario para criação de uma nova transação
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

//evento para adicionar formulario de nova transação
const newTransaction = document.querySelector('#newTransaction')
newTransaction.addEventListener('click', renderNewTransactionForm)

//campos ID do formulario
function idFields(){
    const labelId = document.createElement('label')
    labelId.setAttribute('for', 'transaction-id')
    labelId.textContent = 'ID:'

    const inputId = document.createElement('input')
    inputId.setAttribute('id', 'transaction-id')

    return [labelId, inputId]
}

//renderiza o formulario para editar uma transação
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

//evento para adicionar formulario de editar uma transação
const editTransaction = document.querySelector('#editTransaction')
editTransaction.addEventListener('click', renderEditTransactionForm)


//renderiza o formulario para deletar uma transação
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
//evento para adicionar formulario de deletar uma transação
const deleteTransaction = document.querySelector('#deleteTransaction')
deleteTransaction.addEventListener('click', renderDeleteTransactionForm)


//renderiza a nova transação criada na pagina 
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

//busca as transações no banco de dados
async function fetchTransactions(){
    const transactions = await fetch('http://localhost:3000/transactions')
        .then(res => res.json())        

        transactions.forEach(renderTransactions)
}

//chama a função para buscar as transações assim que a pagina é carregada
document.addEventListener('DOMContentLoaded', () => {
    fetchTransactions()
})



//Metodo POST para enviar novas transações
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

//chama a respectiva função para cada um dos submit
function handleFormSubmit(ev) {
    ev.preventDefault()

    const submitButton = ev.submitter
    const action = submitButton.id

    if (action === 'newTransaction') {
        newTransactionHandler()
    } else if (action === 'editTransaction') {
        editTransactionHandler()
    } else if (action === 'deleteTransaction') {
        deleteTransactionHandler()
    }
}

const form = document.querySelector('#form')
form.addEventListener('submit', handleFormSubmit)