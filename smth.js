'use strict';

let buyList = JSON.parse(localStorage.getItem('buyList')) || [
    { id: 1, name: 'Помідори', qty: 2, isBought: true },
    { id: 2, name: 'Печиво', qty: 2, isBought: false },
    { id: 3, name: 'Сир', qty: 1, isBought: false }
];

function saveState() {
    localStorage.setItem('buyList', JSON.stringify(buyList));
}

function render() {
    const listContainer = document.getElementById('items-list');
    const leftStats = document.getElementById('left-stats');
    const boughtStats = document.getElementById('bought-stats');

    listContainer.innerHTML = '';
    leftStats.innerHTML = '';
    boughtStats.innerHTML = '';

    buyList.forEach(item => {
        const article = document.createElement('article');
        article.className = 'item-row';
        article.dataset.id = item.id;

        const nameSpan = document.createElement('span');
        nameSpan.className = item.isBought ? 'item-name crossed' : 'item-name';
        nameSpan.setAttribute('data-tooltip', item.isBought ? 'Редагування заборонено' : 'Натисніть, щоб редагувати');
        nameSpan.textContent = item.name;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'item-controls';

        if (!item.isBought) {
            const minusBtn = document.createElement('button');
            minusBtn.className = 'btn-circle btn-minus';
            minusBtn.dataset.action = 'minus';
            minusBtn.setAttribute('data-tooltip', 'Зменшити кількість');
            minusBtn.textContent = '-';
            if (item.qty === 1) minusBtn.disabled = true;

            const qtyBadge = document.createElement('span');
            qtyBadge.className = 'qty-badge';
            qtyBadge.textContent = item.qty;

            const plusBtn = document.createElement('button');
            plusBtn.className = 'btn-circle btn-plus';
            plusBtn.dataset.action = 'plus';
            plusBtn.setAttribute('data-tooltip', 'Збільшити кількість');
            plusBtn.textContent = '+';

            controlsDiv.append(minusBtn, qtyBadge, plusBtn);
        } else {
            const qtyBadge = document.createElement('span');
            qtyBadge.className = 'qty-badge';
            qtyBadge.textContent = item.qty;
            controlsDiv.append(qtyBadge);
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';

        const statusBtn = document.createElement('button');
        statusBtn.className = 'btn-status';
        statusBtn.dataset.action = 'toggle';
        statusBtn.setAttribute('data-tooltip', item.isBought ? 'Скасувати покупку' : 'Відмітити як куплене');
        statusBtn.textContent = item.isBought ? 'Не куплено' : 'Куплено';

        actionsDiv.append(statusBtn);

        if (!item.isBought) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.dataset.action = 'delete';
            deleteBtn.setAttribute('aria-label', 'Видалити');
            deleteBtn.setAttribute('data-tooltip', 'Видалити');
            deleteBtn.textContent = '✖';
            actionsDiv.append(deleteBtn);
        }
        article.append(nameSpan, controlsDiv, actionsDiv);
        listContainer.append(article);

        const statItem = document.createElement('span');
        statItem.className = 'product-item';

        const statName = document.createElement('span');
        if (item.isBought) statName.className = 'crossed';
        statName.textContent = item.name;

        const statAmount = document.createElement('span');
        statAmount.className = item.isBought ? 'amount crossed' : 'amount';
        statAmount.textContent = item.qty;

        statItem.append(statName, statAmount);

        if (item.isBought) {
            boughtStats.append(statItem);
        } else {
            leftStats.append(statItem);
        }
    });
    saveState();
}

const inputField = document.getElementById('new-item-input');
const addBtn = document.getElementById('add-btn');

function addItem() {
    const name = inputField.value.trim();
    if (!name) return;
    buyList.push({
        id: Date.now(),
        name: name,
        qty: 1,
        isBought: false
    });
    inputField.value = '';
    inputField.focus();
    render();
}

addBtn.addEventListener('click', addItem);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

document.getElementById('items-list').addEventListener('click', (e) => {
    const article = e.target.closest('.item-row');
    if (!article) return;

    const id = Number(article.dataset.id);
    const item = buyList.find(i => i.id === id);
    if (!item) return;

    const action = e.target.dataset.action;

    if (action === 'delete') {
        buyList = buyList.filter(i => i.id !== id);
        render();
    }
    else if (action === 'plus') {
        item.qty++;
        render();
    }
    else if (action === 'minus') {
        if (item.qty > 1) {
            item.qty--;
            render();
        }
    }
    else if (action === 'toggle') {
        item.isBought = !item.isBought;
        render();
    }

    if (e.target.classList.contains('item-name') && !item.isBought) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'item-input';
        input.value = item.name;

        e.target.replaceWith(input);
        input.focus();

        const saveEdit = () => {
            const newName = input.value.trim();
            if (newName) item.name = newName;
            render();
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') input.blur();
        });
    }
});

render();