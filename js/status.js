/**
 * 报名状态查询脚本
 */
document.addEventListener('DOMContentLoaded', () => {
    initQueryForm();
    initRetryButton();
});

/**
 * 查询表单
 */
function initQueryForm() {
    const form = document.getElementById('queryForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phoneInput = document.getElementById('queryPhone');
        const phone = phoneInput.value.trim();
        
        // 验证手机号
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的11位手机号');
            return;
        }
        
        // 显示加载状态
        const submitBtn = form.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';
        
        try {
            // 模拟API查询
            const result = await queryStatus(phone);
            
            if (result.found) {
                showResult(result.data);
            } else {
                showNotFound();
            }
        } catch (error) {
            alert('查询失败，请稍后重试');
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
        }
    });
}

/**
 * 模拟查询API
 */
async function queryStatus(phone) {
    // 演示数据 - 实际使用时替换为真实API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            // 模拟数据
            const mockData = {
                found: true,
                data: {
                    teamName: '创新先锋队',
                    projectName: 'AI智能客服系统',
                    leader: '张三',
                    phone: phone,
                    submitTime: '2026-04-05 14:30',
                    status: 'pending', // pending, approved, rejected
                    reviewComment: ''
                }
            };
            
            // 随机返回结果（演示用）
            // const random = Math.random();
            // if (random < 0.3) {
            //     resolve({ found: false });
            // } else {
            //     mockData.data.status = random < 0.6 ? 'pending' : 'approved';
            //     resolve(mockData);
            // }
            
            resolve(mockData);
        }, 1000);
    });
}

/**
 * 显示查询结果
 */
function showResult(data) {
    const queryBox = document.getElementById('queryBox');
    const resultBox = document.getElementById('resultBox');
    const notFound = document.getElementById('notFound');
    
    queryBox.style.display = 'none';
    notFound.style.display = 'none';
    resultBox.style.display = 'block';
    
    // 填充数据
    const resultCard = document.getElementById('resultCard');
    resultCard.innerHTML = `
        <h3>${data.teamName} - ${data.projectName}</h3>
        <div class="result-info">
            <div class="result-info-item">
                <span class="result-label">负责人</span>
                <span class="result-value">${data.leader}</span>
            </div>
            <div class="result-info-item">
                <span class="result-label">手机号</span>
                <span class="result-value">${data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
            </div>
            <div class="result-info-item">
                <span class="result-label">报名时间</span>
                <span class="result-value">${data.submitTime}</span>
            </div>
            <div class="result-info-item">
                <span class="result-label">报名状态</span>
                <span class="result-value">${getStatusBadge(data.status)}</span>
            </div>
            ${data.reviewComment ? `
            <div class="result-info-item">
                <span class="result-label">审核意见</span>
                <span class="result-value" style="color: var(--error)">${data.reviewComment}</span>
            </div>
            ` : ''}
        </div>
    `;
    
    // 更新时间线
    updateTimeline(data);
    
    // 滚动到结果区域
    resultBox.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 获取状态徽章HTML
 */
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="status-badge status-pending">待审核</span>',
        reviewing: '<span class="status-badge status-progress">审查中</span>',
        approved: '<span class="status-badge status-approved">已通过</span>',
        rejected: '<span class="status-badge status-rejected">未通过</span>'
    };
    return badges[status] || badges.pending;
}

/**
 * 更新时间线
 */
function updateTimeline(data) {
    const submitTime = document.getElementById('submitTime');
    submitTime.textContent = data.submitTime;
    
    const stepSubmit = document.getElementById('stepSubmit');
    const stepReview = document.getElementById('stepReview');
    const stepNotify = document.getElementById('stepNotify');
    
    // 根据状态更新时间线
    if (data.status === 'pending') {
        stepSubmit.classList.add('completed');
        stepReview.classList.remove('completed');
        stepNotify.classList.remove('completed');
        stepReview.querySelector('.step-icon').textContent = '⏳';
    } else if (data.status === 'approved') {
        stepSubmit.classList.add('completed');
        stepReview.classList.add('completed');
        stepNotify.classList.add('completed');
        stepReview.querySelector('.step-icon').textContent = '✅';
        stepNotify.querySelector('.step-icon').textContent = '✅';
    } else if (data.status === 'rejected') {
        stepSubmit.classList.add('completed');
        stepReview.classList.remove('completed');
        stepReview.querySelector('.step-icon').textContent = '❌';
    }
}

/**
 * 显示未找到
 */
function showNotFound() {
    const queryBox = document.getElementById('queryBox');
    const resultBox = document.getElementById('resultBox');
    const notFound = document.getElementById('notFound');
    
    queryBox.style.display = 'none';
    resultBox.style.display = 'none';
    notFound.style.display = 'block';
    
    // 滚动到未找到区域
    notFound.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 重试按钮
 */
function initRetryButton() {
    const retryBtn = document.getElementById('retryQuery');
    const backQuery = document.getElementById('backQuery');
    
    if (retryBtn) {
        retryBtn.addEventListener('click', resetToQuery);
    }
    
    if (backQuery) {
        backQuery.addEventListener('click', (e) => {
            e.preventDefault();
            resetToQuery();
        });
    }
    
    function resetToQuery() {
        const queryBox = document.getElementById('queryBox');
        const resultBox = document.getElementById('resultBox');
        const notFound = document.getElementById('notFound');
        
        queryBox.style.display = 'block';
        resultBox.style.display = 'none';
        notFound.style.display = 'none';
        
        // 清空输入
        document.getElementById('queryPhone').value = '';
        
        // 重置时间线
        resetTimeline();
        
        // 滚动到查询区域
        queryBox.scrollIntoView({ behavior: 'smooth' });
    }
    
    function resetTimeline() {
        const stepSubmit = document.getElementById('stepSubmit');
        const stepReview = document.getElementById('stepReview');
        const stepNotify = document.getElementById('stepNotify');
        
        stepSubmit.classList.remove('completed');
        stepReview.classList.remove('completed');
        stepNotify.classList.remove('completed');
        
        stepReview.querySelector('.step-icon').textContent = '⏳';
        stepNotify.querySelector('.step-icon').textContent = '📢';
        
        document.getElementById('submitTime').textContent = '--';
    }
}
