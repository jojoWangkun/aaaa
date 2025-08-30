// 全局变量
let efficiencyChart, competenceChart;
let editMode = false;
let originalData = null;

// DOM元素
const elements = {
    editModeToggle: document.getElementById('edit-mode-toggle'),
    editModeText: document.getElementById('edit-mode-text'),
    refreshBtn: document.getElementById('refresh-btn'),
    lastSyncTime: document.getElementById('last-sync-time'),
    onlineCount: document.getElementById('online-count'),
    taskCompletion: document.getElementById('task-completion'),
    avgCompetence: document.getElementById('avg-competence'),
    alertCount: document.getElementById('alert-count'),
    notificationBadge: document.getElementById('notification-badge'),
    employeesTable: document.getElementById('employees-table'),
    activityLog: document.getElementById('activity-log'),
    addEmployeeBtn: document.getElementById('add-employee-btn'),
    employeeModal: document.getElementById('employee-modal'),
    modalContent: document.getElementById('modal-content'),
    modalTitle: document.getElementById('modal-title'),
    closeModal: document.getElementById('close-modal'),
    cancelModal: document.getElementById('cancel-modal'),
    employeeForm: document.getElementById('employee-form'),
    employeeId: document.getElementById('employee-id'),
    nameInput: document.getElementById('name'),
    positionInput: document.getElementById('position'),
    departmentInput: document.getElementById('department'),
    statusInput: document.getElementById('status'),
    competenceScoreInput: document.getElementById('competence_score'),
    taskCompletionInput: document.getElementById('task_completion'),
    notificationToast: document.getElementById('notification-toast'),
    toastTitle: document.getElementById('toast-title'),
    toastMessage: document.getElementById('toast-message'),
    toastIconContainer: document.getElementById('toast-icon-container'),
    closeToast: document.getElementById('close-toast'),
    userMenuButton: document.getElementById('user-menu-button'),
    userMenu: document.getElementById('user-menu'),
    departmentFilter: document.getElementById('department-filter'),
    deptFilter: document.getElementById('dept-filter'),
    sortFilter: document.getElementById('sort-filter'),
    devOnline: document.getElementById('dev-online'),
    marketingOnline: document.getElementById('marketing-online'),
    salesOnline: document.getElementById('sales-online'),
    onlineChange: document.getElementById('online-change'),
    completionChange: document.getElementById('completion-change'),
    competenceChange: document.getElementById('competence-change'),
    completionBar: document.getElementById('completion-bar'),
    completionStatus: document.getElementById('completion-status'),
    delayedTasks: document.getElementById('delayed-tasks'),
    lowEfficiency: document.getElementById('low-efficiency')
};

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    initCharts();
    fetchData();
    
    // 模拟实时数据更新
    setInterval(fetchData, 30000);
});

// 初始化事件监听器
function initEventListeners() {
    // 编辑模式切换
    elements.editModeToggle.addEventListener('change', toggleEditMode);
    
    // 刷新按钮
    elements.refreshBtn.addEventListener('click', () => {
        elements.refreshBtn.classList.add('animate-spin');
        fetchData().then(() => {
            elements.refreshBtn.classList.remove('animate-spin');
            showToast('数据已刷新', '最新数据已加载完成', 'success');
        });
    });
    
    // 添加员工按钮
    elements.addEmployeeBtn.addEventListener('click', openAddEmployeeModal);
    
    // 关闭模态框
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelModal.addEventListener('click', closeModal);
    
    // 员工表单提交
    elements.employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    
    // 关闭通知提示
    elements.closeToast.addEventListener('click', hideToast);
    
    // 用户菜单切换
    elements.userMenuButton.addEventListener('click', toggleUserMenu);
    
    // 部门筛选器变化
    elements.departmentFilter.addEventListener('change', updateCompetenceChart);
    elements.deptFilter.addEventListener('change', filterEmployees);
    elements.sortFilter.addEventListener('change', filterEmployees);
    
    // 点击页面其他地方关闭用户菜单
    document.addEventListener('click', (e) => {
        if (!elements.userMenuContainer.contains(e.target)) {
            elements.userMenu.classList.add('hidden');
        }
    });
}

// 初始化图表
function initCharts() {
    // 效率趋势图
    const efficiencyCtx = document.getElementById('efficiency-trend-chart').getContext('2d');
    efficiencyChart = new Chart(efficiencyCtx, {
        type: 'line',
        data: {
            labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
            datasets: [
                {
                    label: '研发部',
                    data: [65, 70, 75, 50, 60, 75, 80, 85, 90],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '市场部',
                    data: [45, 50, 60, 40, 55, 65, 60, 70, 75],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '销售部',
                    data: [55, 65, 60, 45, 50, 60, 70, 65, 75],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });

    // 能力分布雷达图
    const competenceCtx = document.getElementById('competence-radar-chart').getContext('2d');
    competenceChart = new Chart(competenceCtx, {
        type: 'radar',
        data: {
            labels: ['专业技能', '沟通能力', '解决问题', '团队协作', '学习能力', '创新思维'],
            datasets: [
                {
                    label: '平均水平',
                    data: [70, 65, 60, 75, 68, 55],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3b82f6'
                },
                {
                    label: '优秀水平',
                    data: [85, 80, 85, 90, 85, 80],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#10b981',
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// 获取数据
function fetchData() {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 模拟数据
            const now = new Date();
            elements.lastSyncTime.textContent = now.toLocaleTimeString();
            
            // 更新概览数据
            updateOverviewData();
            
            // 更新员工列表
            updateEmployeesList();
            
            // 更新活动日志
            addActivityLog(`系统自动刷新数据`, 'system');
            
            resolve();
        }, 800);
    });
}

// 更新概览数据
function updateOverviewData() {
    // 模拟数据变化
    const onlineCount = Math.floor(Math.random() * 10) + 15;
    const onlineChange = Math.floor(Math.random() * 5) - 2;
    const taskCompletion = Math.floor(Math.random() * 20) + 70;
    const completionChange = (Math.random() * 5).toFixed(1);
    const avgCompetence = Math.floor(Math.random() * 10) + 75;
    const competenceChange = Math.floor(Math.random() * 5) - 1;
    const alertCount = Math.floor(Math.random() * 5);
    const delayedTasks = Math.floor(Math.random() * 3);
    const lowEfficiency = Math.floor(Math.random() * 2);
    
    // 部门在线人数
    const devOnline = Math.floor(onlineCount * 0.5);
    const marketingOnline = Math.floor(onlineCount * 0.3);
    const salesOnline = onlineCount - devOnline - marketingOnline;
    
    // 更新DOM并添加动画
    updateValueWithAnimation(elements.onlineCount, onlineCount);
    elements.onlineChange.textContent = onlineChange > 0 ? `+${onlineChange}` : onlineChange;
    elements.onlineChange.parentElement.className = onlineChange >= 0 
        ? 'text-green-600 flex items-center' 
        : 'text-red-600 flex items-center';
    
    updateValueWithAnimation(elements.taskCompletion, `${taskCompletion}%`);
    elements.completionChange.textContent = `+${completionChange}%`;
    elements.completionBar.style.width = `${taskCompletion}%`;
    elements.completionStatus.textContent = taskCompletion >= 85 ? '已达标' : '需努力';
    elements.completionStatus.className = taskCompletion >= 85 
        ? 'text-green-600 font-medium' 
        : 'text-yellow-600 font-medium';
    
    updateValueWithAnimation(elements.avgCompetence, avgCompetence);
    elements.competenceChange.textContent = competenceChange > 0 ? `+${competenceChange}` : competenceChange;
    elements.competenceChange.parentElement.className = competenceChange >= 0 
        ? 'text-green-600 flex items-center' 
        : 'text-red-600 flex items-center';
    
    updateValueWithAnimation(elements.alertCount, alertCount);
    elements.notificationBadge.style.display = alertCount > 0 ? 'block' : 'none';
    
    elements.devOnline.textContent = `${devOnline}人`;
    elements.marketingOnline.textContent = `${marketingOnline}人`;
    elements.salesOnline.textContent = `${salesOnline}人`;
    elements.delayedTasks.textContent = delayedTasks;
    elements.lowEfficiency.textContent = lowEfficiency;
}

// 更新员工列表
function updateEmployeesList() {
    // 模拟员工数据
    const employees = [
        { id: 1, name: '张三', position: '高级工程师', department: '研发部', status: '工作中', competence: 92, completion: 95 },
        { id: 2, name: '李四', position: '产品经理', department: '研发部', status: '会议中', competence: 88, completion: 88 },
        { id: 3, name: '王五', position: '销售主管', department: '销售部', status: '工作中', competence: 85, completion: 90 },
        { id: 4, name: '赵六', position: '市场专员', department: '市场部', status: '休息中', competence: 76, completion: 75 },
        { id: 5, name: '钱七', position: '前端开发', department: '研发部', status: '工作中', competence: 80, completion: 82 },
        { id: 6, name: '孙八', position: '销售人员', department: '销售部', status: '离线', competence: 72, completion: 68 }
    ];
    
    originalData = employees;
    filterEmployees();
}

// 筛选员工
function filterEmployees() {
    if (!originalData) return;
    
    const dept = elements.deptFilter.value;
    const sortBy = elements.sortFilter.value;
    
    // 筛选部门
    let filtered = originalData;
    if (dept !== 'all') {
        filtered = originalData.filter(emp => emp.department === dept);
    }
    
    // 排序
    filtered.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'competence') {
            return b.competence - a.competence;
        } else if (sortBy === 'completion') {
            return b.completion - a.completion;
        }
        return 0;
    });
    
    // 更新表格
    renderEmployeesTable(filtered);
}

// 渲染员工表格
function renderEmployeesTable(employees) {
    if (employees.length === 0) {
        elements.employeesTable.innerHTML = `
            <tr>
                <td colspan="6" class="px-3 py-10 text-center text-gray-500">
                    没有找到匹配的员工数据
                </td>
            </tr>
        `;
        return;
    }
    
    elements.employeesTable.innerHTML = employees.map(emp => `
        <tr class="hover:bg-gray-50 transition duration-150 ease-in-out">
            <td class="px-3 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="https://picsum.photos/id/${emp.id + 1000}/40/40" alt="${emp.name}">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${emp.name}</div>
                        <div class="text-sm text-gray-500">${emp.position}</div>
                    </div>
                </div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(emp.department)}">
                    ${emp.department}
                </span>
            </td>
            <td class="px-3 py-4 whitespace-nowrap">
                <span class="flex items-center text-sm text-gray-900">
                    <span class="inline-flex h-2 w-2 rounded-full ${getStatusColor(emp.status)} mr-2"></span>
                    ${emp.status}
                </span>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                    <span class="mr-2">${emp.competence}</span>
                    <div class="w-16 bg-gray-200 rounded-full h-1.5">
                        <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${emp.competence}%"></div>
                    </div>
                </div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                    <span class="mr-2">${emp.completion}%</span>
                    <div class="w-16 bg-gray-200 rounded-full h-1.5">
                        <div class="bg-green-500 h-1.5 rounded-full" style="width: ${emp.completion}%"></div>
                    </div>
                </div>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editEmployee(${emp.id})" class="text-blue-600 hover:text-blue-900 mr-3 ${!editMode ? 'opacity-50 cursor-not-allowed' : ''}" ${!editMode ? 'disabled' : ''}>
                    <i class="fa fa-pencil"></i>
                </button>
                <button onclick="deleteEmployee(${emp.id})" class="text-red-600 hover:text-red-900 ${!editMode ? 'opacity-50 cursor-not-allowed' : ''}" ${!editMode ? 'disabled' : ''}>
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// 获取部门对应的样式类
function getDepartmentColor(department) {
    switch(department) {
        case '研发部': return 'bg-blue-100 text-blue-800';
        case '市场部': return 'bg-green-100 text-green-800';
        case '销售部': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// 获取状态对应的样式类
function getStatusColor(status) {
    switch(status) {
        case '工作中': return 'bg-green-500';
        case '会议中': return 'bg-blue-500';
        case '休息中': return 'bg-yellow-500';
        case '离线': return 'bg-gray-500';
        default: return 'bg-gray-500';
    }
}

// 更新能力分布图表
function updateCompetenceChart() {
    const dept = elements.departmentFilter.value;
    
    // 根据部门更新图表数据
    let data;
    if (dept === '研发部') {
        data = [85, 65, 80, 75, 70, 65];
    } else if (dept === '市场部') {
        data = [60, 85, 75, 80, 75, 85];
    } else if (dept === '销售部') {
        data = [55, 90, 70, 85, 70, 60];
    } else {
        data = [70, 65, 60, 75, 68, 55]; // 全部门
    }
    
    competenceChart.data.datasets[0].data = data;
    competenceChart.update();
}

// 切换编辑模式
function toggleEditMode() {
    editMode = elements.editModeToggle.checked;
    elements.editModeText.textContent = editMode ? '编辑模式' : '查看模式';
    
    // 更新按钮状态
    elements.addEmployeeBtn.disabled = !editMode;
    elements.addEmployeeBtn.classList.toggle('opacity-50', !editMode);
    elements.addEmployeeBtn.classList.toggle('cursor-not-allowed', !editMode);
    
    // 重新渲染员工表格以更新操作按钮状态
    filterEmployees();
    
    showToast(editMode ? '已进入编辑模式' : '已退出编辑模式', 
             editMode ? '现在可以添加、编辑和删除员工数据' : '无法进行修改操作', 
             'info');
}

// 打开添加员工模态框
function openAddEmployeeModal() {
    elements.modalTitle.textContent = '添加新员工';
    elements.employeeId.value = '';
    elements.employeeForm.reset();
    document.getElementById('competence-value').textContent = 70;
    document.getElementById('completion-value').textContent = 0;
    
    openModal();
}

// 编辑员工
function editEmployee(id) {
    if (!originalData) return;
    
    const employee = originalData.find(emp => emp.id === id);
    if (!employee) return;
    
    elements.modalTitle.textContent = '编辑员工信息';
    elements.employeeId.value = employee.id;
    elements.nameInput.value = employee.name;
    elements.positionInput.value = employee.position;
    elements.departmentInput.value = employee.department;
    elements.statusInput.value = employee.status;
    elements.competenceScoreInput.value = employee.competence;
    document.getElementById('competence-value').textContent = employee.competence;
    elements.taskCompletionInput.value = employee.completion;
    document.getElementById('completion-value').textContent = employee.completion;
    
    openModal();
}

// 删除员工
function deleteEmployee(id) {
    if (!confirm('确定要删除这名员工吗？此操作不可撤销。')) {
        return;
    }
    
    if (originalData) {
        const index = originalData.findIndex(emp => emp.id === id);
        if (index !== -1) {
            const deleted = originalData.splice(index, 1)[0];
            filterEmployees();
            addActivityLog(`删除了员工: ${deleted.name}`, 'system');
            showToast('删除成功', `员工 ${deleted.name} 已被删除`, 'success');
        }
    }
}

// 打开模态框
function openModal() {
    elements.employeeModal.classList.remove('hidden');
    // 触发重排后添加动画
    setTimeout(() => {
        elements.modalContent.classList.remove('scale-95', 'opacity-0');
        elements.modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

// 关闭模态框
function closeModal() {
    elements.modalContent.classList.remove('scale-100', 'opacity-100');
    elements.modalContent.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        elements.employeeModal.classList.add('hidden');
    }, 300);
}

// 处理员工表单提交
function handleEmployeeFormSubmit(e) {
    e.preventDefault();
    
    const id = elements.employeeId.value;
    const employeeData = {
        name: elements.nameInput.value,
        position: elements.positionInput.value,
        department: elements.departmentInput.value,
        status: elements.statusInput.value,
        competence: parseInt(elements.competenceScoreInput.value),
        completion: parseInt(elements.taskCompletionInput.value)
    };
    
    if (id) {
        // 更新现有员工
        if (originalData) {
            const index = originalData.findIndex(emp => emp.id === parseInt(id));
            if (index !== -1) {
                originalData[index] = { ...originalData[index], ...employeeData };
                filterEmployees();
                addActivityLog(`更新了员工信息: ${employeeData.name}`, 'system');
                showToast('更新成功', `员工 ${employeeData.name} 的信息已更新`, 'success');
            }
        }
    } else {
        // 添加新员工
        const newId = originalData ? Math.max(...originalData.map(emp => emp.id)) + 1 : 1;
        const newEmployee = { ...employeeData, id: newId };
        
        if (!originalData) originalData = [];
        originalData.push(newEmployee);
        filterEmployees();
        addActivityLog(`添加了新员工: ${employeeData.name}`, 'system');
        showToast('添加成功', `新员工 ${employeeData.name} 已添加`, 'success');
    }
    
    closeModal();
}

// 添加活动日志
function addActivityLog(message, type = 'user') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = 'flex items-start';
    logEntry.innerHTML = `
        <div class="flex-shrink-0 h-6 w-6 rounded-full ${type === 'system' ? 'bg-blue-100' : 'bg-green-100'} flex items-center justify-center mt-0.5">
            <i class="fa ${type === 'system' ? 'fa-cog' : 'fa-user'} text-xs ${type === 'system' ? 'text-blue-600' : 'text-green-600'}"></i>
        </div>
        <div class="ml-3">
            <p class="text-sm text-gray-900">${message}</p>
            <p class="text-xs text-gray-500 mt-0.5">${timeStr}</p>
        </div>
    `;
    
    // 如果当前是加载状态，先清空
    const activityLog = elements.activityLog;
    if (activityLog.querySelector('.fa-spinner')) {
        activityLog.innerHTML = '';
    }
    
    activityLog.prepend(logEntry);
    
    // 限制日志数量
    if (activityLog.children.length > 20) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

// 显示提示框
function showToast(title, message, type = 'success') {
    elements.toastTitle.textContent = title;
    elements.toastMessage.textContent = message;
    
    // 设置图标
    let icon, color;
    switch(type) {
        case 'success':
            icon = 'fa-check-circle';
            color = 'text-green-500';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            color = 'text-red-500';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            color = 'text-yellow-500';
            break;
        case 'info':
            icon = 'fa-info-circle';
            color = 'text-blue-500';
            break;
    }
    
    elements.toastIconContainer.innerHTML = `<i class="fa ${icon} ${color} text-xl"></i>`;
    
    // 显示提示框
    elements.notificationToast.classList.remove('hidden', 'translate-y-10', 'opacity-0');
    elements.notificationToast.classList.add('translate-y-0', 'opacity-100');
    
    // 自动隐藏
    setTimeout(hideToast, 3000);
}

// 隐藏提示框
function hideToast() {
    elements.notificationToast.classList.remove('translate-y-0', 'opacity-100');
    elements.notificationToast.classList.add('translate-y-10', 'opacity-0');
    
    setTimeout(() => {
        elements.notificationToast.classList.add('hidden');
    }, 300);
}

// 切换用户菜单
function toggleUserMenu() {
    elements.userMenu.classList.toggle('hidden');
}

// 更新值并添加动画
function updateValueWithAnimation(element, value) {
    element.textContent = value;
    element.classList.add('animate-value-change');
    setTimeout(() => {
        element.classList.remove('animate-value-change');
    }, 500);
}

// 暴露函数到全局，以便在HTML中调用
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
