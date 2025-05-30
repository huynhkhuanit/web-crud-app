// Dynamic API URL that works for both local and Vercel deployment
const getApiUrl = () => {
    // If running on localhost, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api/data';
    }
    // If running on Vercel or any other production domain, use relative URL
    return '/api/data';
};

const apiUrl = getApiUrl();

// Global variables
let currentData = [];
let deleteItemId = null;

// DOM Elements
const elements = {
    dataForm: null,
    editForm: null,
    dataList: null,
    messageContainer: null,
    searchInput: null,
    totalItems: null,
    loading: null,
    editModal: null,
    deleteModal: null,
    emptyState: null
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    hideLoading();
    fetchData();
});

// Initialize DOM elements
function initializeElements() {
    elements.dataForm = document.getElementById('dataForm');
    elements.editForm = document.getElementById('editForm');
    elements.dataList = document.getElementById('dataList');
    elements.messageContainer = document.getElementById('message');
    elements.searchInput = document.getElementById('searchInput');
    elements.totalItems = document.getElementById('totalItems');
    elements.loading = document.getElementById('loading');
    elements.editModal = document.getElementById('editModal');
    elements.deleteModal = document.getElementById('deleteModal');
    elements.emptyState = document.getElementById('emptyState');
}

// Setup event listeners
function setupEventListeners() {
    if (elements.dataForm) {
        elements.dataForm.addEventListener('submit', handleAddData);
    }
    
    if (elements.editForm) {
        elements.editForm.addEventListener('submit', handleEditData);
    }
    
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Close modals when clicking outside
    elements.editModal?.addEventListener('click', (e) => {
        if (e.target === elements.editModal) closeModal();
    });
    
    elements.deleteModal?.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
        }
    });
}

// Show/Hide loading spinner
function showLoading() {
    if (elements.loading) {
        elements.loading.classList.add('show');
    }
}

function hideLoading() {
    if (elements.loading) {
        elements.loading.classList.remove('show');
    }
}

// Show messages with animation
function showMessage(message, type = 'success') {
    if (!elements.messageContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const icon = getMessageIcon(type);
    alertDiv.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    elements.messageContainer.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }
    }, 5000);
}

// Get icon for message type
function getMessageIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Add CSS for slide out animation
if (!document.querySelector('#slideOutStyle')) {
    const style = document.createElement('style');
    style.id = 'slideOutStyle';
    style.textContent = `
        @keyframes slideOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch data from API
async function fetchData() {
    try {
        showLoading();
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentData = data;
        renderDataList(data);
        updateStats(data.length);
        
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        showMessage('Không thể tải dữ liệu. Vui lòng thử lại.', 'error');
        showEmptyState();
    } finally {
        hideLoading();
    }
}

// Render data list with animation
function renderDataList(data) {
    if (!elements.dataList) return;
    
    if (data.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    // Clear existing items with fade out
    const existingItems = elements.dataList.querySelectorAll('.data-item');
    existingItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'fadeOut 0.2s ease-out forwards';
        }, index * 50);
    });
    
    // Wait for fade out to complete, then render new items
    setTimeout(() => {
        elements.dataList.innerHTML = '';
        
        data.forEach((item, index) => {
            const itemElement = createDataItemElement(item);
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateY(20px)';
            elements.dataList.appendChild(itemElement);
            
            // Animate in with stagger
            setTimeout(() => {
                itemElement.style.transition = 'all 0.3s ease-out';
                itemElement.style.opacity = '1';
                itemElement.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// Add fade out animation
if (!document.querySelector('#fadeOutStyle')) {
    const style = document.createElement('style');
    style.id = 'fadeOutStyle';
    style.textContent = `
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Create data item element
function createDataItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'data-item';
    itemDiv.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">${escapeHtml(item.name)}</h3>
            <div class="item-actions">
                <button class="btn btn-sm btn-secondary" onclick="openEditModal(${item.id})" title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${item.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="item-description">
            ${escapeHtml(item.description || 'Không có mô tả')}
        </div>
        <div class="item-meta">
            <span class="item-id">ID: ${item.id}</span>
            <span class="item-date">${formatDate(item.createdAt)}</span>
        </div>
    `;
    return itemDiv;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text?.toString().replace(/[&<>"']/g, (m) => map[m]) || '';
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show/Hide empty state
function showEmptyState() {
    if (elements.emptyState) {
        elements.emptyState.style.display = 'block';
    }
    if (elements.dataList) {
        elements.dataList.style.display = 'none';
    }
}

function hideEmptyState() {
    if (elements.emptyState) {
        elements.emptyState.style.display = 'none';
    }
    if (elements.dataList) {
        elements.dataList.style.display = 'grid';
    }
}

// Update statistics
function updateStats(total) {
    if (elements.totalItems) {
        // Animate number change
        const currentValue = parseInt(elements.totalItems.textContent) || 0;
        animateNumber(elements.totalItems, currentValue, total, 500);
    }
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (range * easeOutQuart(progress)));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Easing function
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Handle add data form submission
async function handleAddData(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name')?.trim(),
        description: formData.get('description')?.trim() || ''
    };
    
    if (!data.name) {
        showMessage('Vui lòng nhập tên mục!', 'error');
        return;
    }
    
    try {
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang thêm...';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await response.json();
        
        // Reset form with animation
        event.target.reset();
        event.target.style.animation = 'pulse 0.3s ease-out';
        
        showMessage('Đã thêm mục mới thành công!', 'success');
        await fetchData();
        
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        showMessage('Không thể thêm dữ liệu. Vui lòng thử lại.', 'error');
    } finally {
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-plus"></i> Thêm Mới';
    }
}

// Add pulse animation
if (!document.querySelector('#pulseStyle')) {
    const style = document.createElement('style');
    style.id = 'pulseStyle';
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Open edit modal
function openEditModal(id) {
    const item = currentData.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('editId').value = item.id;
    document.getElementById('editName').value = item.name;
    document.getElementById('editDescription').value = item.description || '';
    
    elements.editModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('editName').focus();
    }, 100);
}

// Close edit modal
function closeModal() {
    elements.editModal?.classList.remove('show');
    document.body.style.overflow = '';
}

// Handle edit form submission
async function handleEditData(event) {
    event.preventDefault();
    
    const id = document.getElementById('editId').value;
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name')?.trim(),
        description: formData.get('description')?.trim() || ''
    };
    
    if (!data.name) {
        showMessage('Vui lòng nhập tên mục!', 'error');
        return;
    }
    
    try {
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
        
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await response.json();
        
        closeModal();
        showMessage('Đã cập nhật mục thành công!', 'success');
        await fetchData();
        
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
        showMessage('Không thể cập nhật dữ liệu. Vui lòng thử lại.', 'error');
    } finally {
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-save"></i> Lưu Thay Đổi';
    }
}

// Open delete confirmation modal
function openDeleteModal(id) {
    deleteItemId = id;
    elements.deleteModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Setup confirm button
    const confirmButton = document.getElementById('confirmDelete');
    confirmButton.onclick = () => handleDeleteData(id);
}

// Close delete modal
function closeDeleteModal() {
    elements.deleteModal?.classList.remove('show');
    document.body.style.overflow = '';
    deleteItemId = null;
}

// Handle delete data
async function handleDeleteData(id) {
    try {
        const confirmButton = document.getElementById('confirmDelete');
        confirmButton.disabled = true;
        confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
        
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        closeDeleteModal();
        showMessage('Đã xóa mục thành công!', 'success');
        await fetchData();
        
    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
        showMessage('Không thể xóa dữ liệu. Vui lòng thử lại.', 'error');
    } finally {
        const confirmButton = document.getElementById('confirmDelete');
        confirmButton.disabled = false;
        confirmButton.innerHTML = '<i class="fas fa-trash"></i> Xóa';
    }
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderDataList(currentData);
        return;
    }
    
    const filteredData = currentData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm))
    );
    
    renderDataList(filteredData);
    
    if (filteredData.length === 0) {
        showMessage(`Không tìm thấy kết quả cho "${searchTerm}"`, 'warning');
    }
}

// Refresh data
async function refreshData() {
    showMessage('Đang làm mới dữ liệu...', 'info');
    await fetchData();
    showMessage('Đã làm mới dữ liệu thành công!', 'success');
}

// Global functions for onclick handlers
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.refreshData = refreshData;