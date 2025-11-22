// Personal Expense Tracker - Complete JavaScript Application

class ExpenseTracker {
    constructor() {
        this.transactions = [];
        this.editingTransactionId = null;
        this.transactionToDelete = null;
        this.charts = {};
        
        // Sample data from requirements
        this.sampleTransactions = [
            {
                id: "txn_001",
                amount: 5000,
                category: "Salary",
                type: "income",
                date: "2024-10-01",
                description: "Monthly salary",
                timestamp: Date.now() - (30 * 24 * 60 * 60 * 1000)
            },
            {
                id: "txn_002", 
                amount: 1200,
                category: "Food",
                type: "expense",
                date: "2024-10-02",
                description: "Groceries and dining",
                timestamp: Date.now() - (29 * 24 * 60 * 60 * 1000)
            },
            {
                id: "txn_003",
                amount: 800,
                category: "Travel",
                type: "expense", 
                date: "2024-10-03",
                description: "Monthly bus pass",
                timestamp: Date.now() - (28 * 24 * 60 * 60 * 1000)
            },
            {
                id: "txn_004",
                amount: 2000,
                category: "Bills",
                type: "expense",
                date: "2024-10-04",
                description: "Electricity and water bill",
                timestamp: Date.now() - (27 * 24 * 60 * 60 * 1000)
            },
            {
                id: "txn_005",
                amount: 500,
                category: "Entertainment",
                type: "expense",
                date: "2024-10-05",
                description: "Movie and dinner",
                timestamp: Date.now() - (26 * 24 * 60 * 60 * 1000)
            }
        ];
        
        this.categories = {
            income: ["Salary", "Freelance", "Investment", "Business", "Gift", "Other Income"],
            expense: ["Food", "Travel", "Bills", "Entertainment", "Healthcare", "Shopping", "Education", "Insurance", "Other"]
        };
        
        this.budgets = {
            Food: 3000,
            Travel: 1500, 
            Bills: 2500,
            Entertainment: 1000,
            Healthcare: 2000,
            Shopping: 2000,
            Education: 1500
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateCategories();
        this.updateDashboard();
        this.renderTransactions();
        this.setDefaultDates();
        
        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.initCharts();
            this.renderBudgets();
        }, 100);
        
        // Show welcome notification after everything is loaded
        setTimeout(() => {
            this.showNotification('Welcome to Personal Expense Tracker!', 'success');
        }, 200);
    }
    
    loadData() {
        const stored = localStorage.getItem('expense-tracker-data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.transactions = data.transactions || [];
                if (data.budgets) {
                    this.budgets = { ...this.budgets, ...data.budgets };
                }
            } catch (error) {
                console.error('Error loading data:', error);
                this.initializeSampleData();
            }
        } else {
            this.initializeSampleData();
        }
    }
    
    initializeSampleData() {
        this.transactions = [...this.sampleTransactions];
        this.saveData();
    }
    
    saveData() {
        const data = {
            transactions: this.transactions,
            budgets: this.budgets,
            timestamp: Date.now()
        };
        localStorage.setItem('expense-tracker-data', JSON.stringify(data));
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Modal events
        const addBtn = document.getElementById('add-transaction-btn');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAddModal();
            });
        }
        
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        const cancelBtn = document.getElementById('cancel-transaction');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        const saveBtn = document.getElementById('save-transaction');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveTransaction();
            });
        }
        
        const form = document.getElementById('transaction-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTransaction();
            });
        }
        
        // Delete modal events
        const closeDeleteBtn = document.getElementById('close-delete-modal');
        if (closeDeleteBtn) {
            closeDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDeleteModal();
            });
        }
        
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDeleteModal();
            });
        }
        
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmDelete();
            });
        }
        
        // Filter events
        const startDate = document.getElementById('start-date');
        if (startDate) {
            startDate.addEventListener('change', () => this.applyFilters());
        }
        
        const endDate = document.getElementById('end-date');
        if (endDate) {
            endDate.addEventListener('change', () => this.applyFilters());
        }
        
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.applyFilters());
        }
        
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }
        
        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearFilters();
            });
        }
        
        const sortSelect = document.getElementById('sort-transactions');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.applyFilters());
        }
        
        // Export
        const exportBtn = document.getElementById('export-csv-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportCSV();
            });
        }
        
        // Type change in modal
        const typeSelect = document.getElementById('type');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                console.log('Type changed to:', e.target.value);
                this.updateCategoriesForType(e.target.value);
            });
        }
        
        // Notification close
        const notificationClose = document.getElementById('close-notification');
        if (notificationClose) {
            notificationClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideNotification();
            });
        }
        
        // Modal overlay clicks
        const transactionModal = document.getElementById('transaction-modal');
        if (transactionModal) {
            transactionModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeModal();
                }
            });
        }
        
        const deleteModal = document.getElementById('delete-modal');
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeDeleteModal();
                }
            });
        }
        
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDeleteModal();
            }
        });
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Render content for active tab
        if (tabName === 'analytics') {
            setTimeout(() => this.updateCharts(), 100);
        } else if (tabName === 'budgets') {
            this.renderBudgets();
        }
    }
    
    populateCategories() {
        const categoryFilter = document.getElementById('category-filter');
        
        if (!categoryFilter) return;
        
        // Clear existing options (except "All Categories" for filter)
        while (categoryFilter.children.length > 1) {
            categoryFilter.removeChild(categoryFilter.lastChild);
        }
        
        // Add all categories to filter
        const allCategories = [...this.categories.income, ...this.categories.expense];
        const uniqueCategories = [...new Set(allCategories)];
        
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    updateCategoriesForType(type) {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) {
            console.error('Category select element not found');
            return;
        }
        
        console.log('Updating categories for type:', type);
        console.log('Available categories:', this.categories[type]);
        
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        if (type && this.categories[type]) {
            this.categories[type].forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
                console.log('Added category option:', category);
            });
        }
        
        console.log('Category select now has', categorySelect.children.length, 'options');
    }
    
    setDefaultDates() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const dateInput = document.getElementById('date');
        
        if (startDateInput) startDateInput.value = firstDay.toISOString().split('T')[0];
        if (endDateInput) endDateInput.value = lastDay.toISOString().split('T')[0];
        if (dateInput) dateInput.value = now.toISOString().split('T')[0];
    }
    
    openAddModal() {
        this.editingTransactionId = null;
        const modal = document.getElementById('transaction-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('transaction-form');
        const dateInput = document.getElementById('date');
        const amountInput = document.getElementById('amount');
        const typeSelect = document.getElementById('type');
        const categorySelect = document.getElementById('category');
        
        if (!modal) return;
        
        if (title) title.textContent = 'Add Transaction';
        if (form) form.reset();
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        
        // Reset category dropdown to default state
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>';
        }
        
        // Reset type to default
        if (typeSelect) {
            typeSelect.value = '';
        }
        
        modal.classList.remove('hidden');
        
        if (amountInput) {
            setTimeout(() => amountInput.focus(), 100);
        }
        
        console.log('Add modal opened');
    }
    
    openEditModal(transaction) {
        this.editingTransactionId = transaction.id;
        const modal = document.getElementById('transaction-modal');
        const title = document.getElementById('modal-title');
        
        if (!modal) return;
        
        if (title) title.textContent = 'Edit Transaction';
        
        // Populate form
        const amountInput = document.getElementById('amount');
        const typeSelect = document.getElementById('type');
        const dateInput = document.getElementById('date');
        const descInput = document.getElementById('description');
        
        if (amountInput) amountInput.value = transaction.amount;
        if (typeSelect) typeSelect.value = transaction.type;
        if (dateInput) dateInput.value = transaction.date;
        if (descInput) descInput.value = transaction.description;
        
        // Update categories and set category
        this.updateCategoriesForType(transaction.type);
        setTimeout(() => {
            const categorySelect = document.getElementById('category');
            if (categorySelect) categorySelect.value = transaction.category;
        }, 10);
        
        modal.classList.remove('hidden');
    }
    
    closeModal() {
        const modal = document.getElementById('transaction-modal');
        const form = document.getElementById('transaction-form');
        
        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
        this.editingTransactionId = null;
    }
    
    saveTransaction() {
        const form = document.getElementById('transaction-form');
        if (!form) {
            this.showNotification('Form not found', 'error');
            return;
        }
        
        const amountInput = document.getElementById('amount');
        const typeSelect = document.getElementById('type');
        const categorySelect = document.getElementById('category');
        const dateInput = document.getElementById('date');
        const descInput = document.getElementById('description');
        
        if (!amountInput || !typeSelect || !categorySelect || !dateInput || !descInput) {
            this.showNotification('Form elements not found', 'error');
            return;
        }
        
        const amount = parseFloat(amountInput.value);
        const type = typeSelect.value;
        const category = categorySelect.value;
        const date = dateInput.value;
        const description = descInput.value.trim();
        
        // Enhanced validation with specific error messages
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            amountInput.focus();
            return;
        }
        
        if (!type) {
            this.showNotification('Please select a transaction type', 'error');
            typeSelect.focus();
            return;
        }
        
        if (!category) {
            this.showNotification('Please select a category', 'error');
            categorySelect.focus();
            return;
        }
        
        if (!date) {
            this.showNotification('Please enter a date', 'error');
            dateInput.focus();
            return;
        }
        
        if (!description) {
            this.showNotification('Please enter a description', 'error');
            descInput.focus();
            return;
        }
        
        const transactionData = {
            id: this.editingTransactionId || 'txn_' + Date.now(),
            amount,
            type,
            category,
            date,
            description,
            timestamp: Date.now()
        };
        
        if (this.editingTransactionId) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === this.editingTransactionId);
            if (index !== -1) {
                this.transactions[index] = transactionData;
                this.showNotification('Transaction updated successfully!', 'success');
            }
        } else {
            // Add new transaction
            this.transactions.push(transactionData);
            this.showNotification('Transaction added successfully!', 'success');
        }
        
        this.saveData();
        this.closeModal();
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
        this.renderBudgets();
    }
    
    deleteTransaction(id) {
        this.transactionToDelete = id;
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    confirmDelete() {
        if (this.transactionToDelete) {
            this.transactions = this.transactions.filter(t => t.id !== this.transactionToDelete);
            this.saveData();
            this.updateDashboard();
            this.renderTransactions();
            this.updateCharts();
            this.renderBudgets();
            this.showNotification('Transaction deleted successfully!', 'success');
        }
        this.closeDeleteModal();
    }
    
    closeDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.transactionToDelete = null;
    }
    
    updateDashboard() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netSavings = totalIncome - totalExpenses;
        
        const incomeEl = document.getElementById('total-income');
        const expensesEl = document.getElementById('total-expenses');
        const savingsEl = document.getElementById('net-savings');
        
        if (incomeEl) incomeEl.textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
        if (expensesEl) expensesEl.textContent = `₹${totalExpenses.toLocaleString('en-IN')}`;
        if (savingsEl) {
            savingsEl.textContent = `₹${netSavings.toLocaleString('en-IN')}`;
            savingsEl.classList.remove('positive', 'negative');
            savingsEl.classList.add(netSavings >= 0 ? 'positive' : 'negative');
        }
    }
    
    applyFilters() {
        const startDateEl = document.getElementById('start-date');
        const endDateEl = document.getElementById('end-date');
        const typeFilterEl = document.getElementById('type-filter');
        const categoryFilterEl = document.getElementById('category-filter');
        const searchEl = document.getElementById('search-input');
        const sortEl = document.getElementById('sort-transactions');
        
        const startDate = startDateEl ? startDateEl.value : '';
        const endDate = endDateEl ? endDateEl.value : '';
        const typeFilter = typeFilterEl ? typeFilterEl.value : 'all';
        const categoryFilter = categoryFilterEl ? categoryFilterEl.value : 'all';
        const searchTerm = searchEl ? searchEl.value.toLowerCase() : '';
        const sortBy = sortEl ? sortEl.value : 'date-desc';
        
        let filtered = [...this.transactions];
        
        // Date filter
        if (startDate) {
            filtered = filtered.filter(t => t.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(t => t.date <= endDate);
        }
        
        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }
        
        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm) ||
                t.category.toLowerCase().includes(searchTerm) ||
                t.amount.toString().includes(searchTerm)
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
        
        this.renderTransactions(filtered);
    }
    
    clearFilters() {
        const startDateEl = document.getElementById('start-date');
        const endDateEl = document.getElementById('end-date');
        const typeFilterEl = document.getElementById('type-filter');
        const categoryFilterEl = document.getElementById('category-filter');
        const searchEl = document.getElementById('search-input');
        const sortEl = document.getElementById('sort-transactions');
        
        if (startDateEl) startDateEl.value = '';
        if (endDateEl) endDateEl.value = '';
        if (typeFilterEl) typeFilterEl.value = 'all';
        if (categoryFilterEl) categoryFilterEl.value = 'all';
        if (searchEl) searchEl.value = '';
        if (sortEl) sortEl.value = 'date-desc';
        
        this.renderTransactions();
    }
    
    renderTransactions(transactionsToRender = null) {
        const transactions = transactionsToRender || [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        const tbody = document.getElementById('transactions-table-body');
        const noTransactions = document.getElementById('no-transactions');
        
        if (!tbody || !noTransactions) return;
        
        tbody.innerHTML = '';
        
        if (transactions.length === 0) {
            noTransactions.classList.remove('hidden');
            return;
        }
        
        noTransactions.classList.add('hidden');
        
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.className = 'transaction-row';
            
            const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN');
            const formattedAmount = transaction.amount.toLocaleString('en-IN');
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${this.escapeHtml(transaction.description)}</td>
                <td>${this.escapeHtml(transaction.category)}</td>
                <td>
                    <span class="transaction-type ${transaction.type}">${transaction.type}</span>
                </td>
                <td class="transaction-amount ${transaction.type}">₹${formattedAmount}</td>
                <td>
                    <div class="transaction-actions">
                        <button class="action-btn edit" onclick="window.expenseTracker.editTransaction('${transaction.id}')">Edit</button>
                        <button class="action-btn delete" onclick="window.expenseTracker.deleteTransaction('${transaction.id}')">Delete</button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.openEditModal(transaction);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    initCharts() {
        this.initExpensePieChart();
        this.initIncomeExpenseBarChart();
        this.initMonthlyTrendsChart();
        this.updateCategoryBreakdown();
    }
    
    initExpensePieChart() {
        const ctx = document.getElementById('expense-pie-chart');
        if (!ctx) return;
        
        this.charts.expensePie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    initIncomeExpenseBarChart() {
        const ctx = document.getElementById('income-expense-bar-chart');
        if (!ctx) return;
        
        this.charts.incomeExpenseBar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['This Month'],
                datasets: [{
                    label: 'Income',
                    data: [0],
                    backgroundColor: '#1FB8CD'
                }, {
                    label: 'Expenses',
                    data: [0],
                    backgroundColor: '#B4413C'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    initMonthlyTrendsChart() {
        const ctx = document.getElementById('monthly-trends-chart');
        if (!ctx) return;
        
        this.charts.monthlyTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    updateCharts() {
        this.updateExpensePieChart();
        this.updateIncomeExpenseBarChart();
        this.updateMonthlyTrendsChart();
        this.updateCategoryBreakdown();
    }
    
    updateExpensePieChart() {
        if (!this.charts.expensePie) return;
        
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};
        
        expenses.forEach(transaction => {
            categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
        });
        
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        
        this.charts.expensePie.data.labels = labels;
        this.charts.expensePie.data.datasets[0].data = data;
        this.charts.expensePie.update();
    }
    
    updateIncomeExpenseBarChart() {
        if (!this.charts.incomeExpenseBar) return;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyIncome = this.transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = this.transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
        
        this.charts.incomeExpenseBar.data.datasets[0].data = [monthlyIncome];
        this.charts.incomeExpenseBar.data.datasets[1].data = [monthlyExpenses];
        this.charts.incomeExpenseBar.update();
    }
    
    updateMonthlyTrendsChart() {
        if (!this.charts.monthlyTrends) return;
        
        const monthlyData = {};
        
        this.transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0 };
            }
            
            monthlyData[monthKey][transaction.type] += transaction.amount;
        });
        
        const sortedMonths = Object.keys(monthlyData).sort();
        const labels = sortedMonths.map(month => {
            const [year, monthNum] = month.split('-');
            const date = new Date(year, monthNum - 1);
            return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        });
        
        const incomeData = sortedMonths.map(month => monthlyData[month].income);
        const expenseData = sortedMonths.map(month => monthlyData[month].expense);
        
        this.charts.monthlyTrends.data.labels = labels;
        this.charts.monthlyTrends.data.datasets[0].data = incomeData;
        this.charts.monthlyTrends.data.datasets[1].data = expenseData;
        this.charts.monthlyTrends.update();
    }
    
    updateCategoryBreakdown() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};
        
        expenses.forEach(transaction => {
            categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
        });
        
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        const container = document.getElementById('category-breakdown');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (sortedCategories.length === 0) {
            container.innerHTML = '<p class="no-data">No expense data available</p>';
            return;
        }
        
        sortedCategories.forEach(([category, amount]) => {
            const item = document.createElement('div');
            item.className = 'category-stat';
            item.innerHTML = `
                <span class="category-name">${this.escapeHtml(category)}</span>
                <span class="category-amount">₹${amount.toLocaleString('en-IN')}</span>
            `;
            container.appendChild(item);
        });
    }
    
    renderBudgets() {
        const budgetList = document.getElementById('budget-list');
        if (!budgetList) return;
        
        budgetList.innerHTML = '';
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        Object.entries(this.budgets).forEach(([category, budget]) => {
            const spent = this.transactions
                .filter(t => {
                    const date = new Date(t.date);
                    return t.type === 'expense' && 
                           t.category === category && 
                           date.getMonth() === currentMonth && 
                           date.getFullYear() === currentYear;
                })
                .reduce((sum, t) => sum + t.amount, 0);
            
            const percentage = (spent / budget) * 100;
            const remaining = budget - spent;
            
            let status = 'under';
            let progressClass = '';
            
            if (percentage >= 100) {
                status = 'over';
                progressClass = 'danger';
            } else if (percentage >= 80) {
                status = 'warning';
                progressClass = 'warning';
            }
            
            const budgetItem = document.createElement('div');
            budgetItem.className = 'budget-item';
            budgetItem.innerHTML = `
                <div class="budget-header">
                    <span class="budget-category">${this.escapeHtml(category)}</span>
                    <span class="budget-amounts">₹${spent.toLocaleString('en-IN')} / ₹${budget.toLocaleString('en-IN')}</span>
                </div>
                <div class="budget-progress">
                    <div class="budget-progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                <div class="budget-status ${status}">
                    ${remaining >= 0 ? `₹${remaining.toLocaleString('en-IN')} remaining` : `₹${Math.abs(remaining).toLocaleString('en-IN')} over budget`}
                    (${percentage.toFixed(1)}%)
                </div>
            `;
            
            budgetList.appendChild(budgetItem);
        });
    }
    
    exportCSV() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to export', 'error');
            return;
        }
        
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...this.transactions.map(t => [
                t.date,
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Transactions exported successfully!', 'success');
    }
    
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notification-message');
        
        if (!notification || !messageElement) return;
        
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 3000);
    }
    
    hideNotification() {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.classList.add('hiding');
        
        setTimeout(() => {
            notification.classList.add('hidden');
            notification.classList.remove('hiding');
        }, 300);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.expenseTracker = new ExpenseTracker();
});