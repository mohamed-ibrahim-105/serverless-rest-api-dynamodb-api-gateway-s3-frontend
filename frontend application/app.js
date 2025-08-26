// Replace with your actual API Gateway endpoint
const API_BASE_URL = 'https://833werasu3.execute-api.ap-south-1.amazonaws.com/prod';

// DOM elements
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const addBtn = document.getElementById('add-btn');
const customersContainer = document.getElementById('customers-container');

// Fetch all customers
async function fetchCustomers() {
    try {
        console.log('Fetching customers from:', `${API_BASE_URL}/customers`);
        const response = await fetch(`${API_BASE_URL}/customers`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const customers = await response.json();
            console.log('Customers data:', customers);
            displayCustomers(customers);
        } else {
            throw new Error(`Failed to fetch customers: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching customers:', error);
        customersContainer.innerHTML = '<p>Error loading customers. Please refresh the page.</p>';
    }
}

// Add a new customer
async function addCustomer() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    if (!firstName || !lastName || !email) {
        alert('First name, last name, and email are required');
        return;
    }

    try {
        console.log('Adding customer to:', `${API_BASE_URL}/customers`);
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, phone, address })
        });

        console.log('Add response status:', response.status);
        
        if (response.ok) {
            const customer = await response.json();
            console.log('Added customer:', customer);
            alert('Customer added successfully!');
            clearForm();
            fetchCustomers(); // Refresh the list
        } else {
            const errorText = await response.text();
            throw new Error(`Failed to add customer: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error adding customer:', error);
        alert('Failed to add customer. Check console for details.');
    }
}

// Display customers in the UI
function displayCustomers(customers) {
    if (customers.length === 0) {
        customersContainer.innerHTML = '<p>No customers found. Add your first customer above.</p>';
        return;
    }

    customersContainer.innerHTML = '';
    customers.forEach(customer => {
        const customerCard = document.createElement('div');
        customerCard.className = 'customer-card';
        customerCard.innerHTML = `
            <h3>${customer.firstName} ${customer.lastName}</h3>
            <p><strong>Email:</strong> ${customer.email}</p>
            ${customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
            ${customer.address ? `<p><strong>Address:</strong> ${customer.address}</p>` : ''}
            <p><strong>ID:</strong> ${customer.customerId}</p>
            <div class="customer-actions">
                <button class="btn-edit" onclick="editCustomer('${customer.customerId}')">Edit</button>
                <button class="btn-delete" onclick="deleteCustomer('${customer.customerId}')">Delete</button>
            </div>
        `;
        customersContainer.appendChild(customerCard);
    });
}

// Clear the form
function clearForm() {
    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    addressInput.value = '';
}

// Edit a customer
async function editCustomer(customerId) {
    console.log('Editing customer:', customerId);
    
    const newFirstName = prompt('Enter new first name:');
    if (!newFirstName) return;

    const newLastName = prompt('Enter new last name:');
    const newEmail = prompt('Enter new email:');
    const newPhone = prompt('Enter new phone:');
    const newAddress = prompt('Enter new address:');

    try {
        console.log('Updating customer at:', `${API_BASE_URL}/customers/${customerId}`);
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
                phone: newPhone,
                address: newAddress
            })
        });

        console.log('Update response status:', response.status);
        
        if (response.ok) {
            const updatedCustomer = await response.json();
            console.log('Updated customer:', updatedCustomer);
            alert('Customer updated successfully!');
            fetchCustomers(); // Refresh the list
        } else {
            const errorText = await response.text();
            throw new Error(`Failed to update customer: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        alert('Failed to update customer. Check console for details.');
    }
}

// Delete a customer
async function deleteCustomer(customerId) {
    console.log('Deleting customer:', customerId);
    
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
        console.log('Deleting customer at:', `${API_BASE_URL}/customers/${customerId}`);
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'DELETE'
        });

        console.log('Delete response status:', response.status);
        
        if (response.ok) {
            console.log('Customer deleted successfully');
            alert('Customer deleted successfully!');
            fetchCustomers(); // Refresh the list
        } else {
            const errorText = await response.text();
            throw new Error(`Failed to delete customer: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer. Check console for details.');
    }
}

// Event listeners
addBtn.addEventListener('click', addCustomer);

// Initial fetch
fetchCustomers();

// Make functions available globally for button clicks
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer; 