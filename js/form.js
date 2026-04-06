/**
 * 报名表单脚本
 */
document.addEventListener('DOMContentLoaded', () => {
    initCharCount();
    initFileUpload();
    initFormSubmit();
});

/**
 * 字数统计
 */
function initCharCount() {
    const textarea = document.getElementById('coreProblem');
    const counter = document.getElementById('coreProblemCount');
    
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
        });
    }
}

/**
 * 文件上传
 */
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileUpload');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) {
            handleFile(fileInput.files[0]);
        }
    });
    
    removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        uploadPlaceholder.style.display = 'block';
        uploadSuccess.style.display = 'none';
    });
    
    function handleFile(file) {
        // 验证文件大小（50MB）
        if (file.size > 50 * 1024 * 1024) {
            alert('文件大小不能超过50MB');
            return;
        }
        
        // 验证文件类型
        if (!file.name.match(/\.(pdf|doc|docx|zip)$/i)) {
            alert('只支持 PDF、Word、ZIP 格式');
            return;
        }
        
        // 显示成功状态
        uploadPlaceholder.style.display = 'none';
        uploadSuccess.style.display = 'flex';
        fileName.textContent = file.name;
    }
}

/**
 * 表单提交
 */
function initFormSubmit() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 验证表单
        if (!validateForm()) {
            return;
        }
        
        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';
        
        // 收集表单数据
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // 获取团队成员
        const members = [];
        for (let i = 1; i <= 4; i++) {
            const member = data[`member${i}`];
            if (member) members.push(member);
        }
        data.members = members.join('、');
        
        try {
            // 这里可以发送到后端API
            // 演示使用 setTimeout 模拟API调用
            await simulateSubmit(data);
            
            // 显示成功
            showSuccess(data);
        } catch (error) {
            alert('提交失败，请稍后重试');
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
        }
    });
    
    function validateForm() {
        const required = ['teamName', 'department', 'category', 'projectName', 'coreProblem', 'leaderName', 'leaderPhone', 'leaderEmail'];
        const phone = document.getElementById('leaderPhone').value;
        const email = document.getElementById('leaderEmail').value;
        const agreement = document.getElementById('agreement').checked;
        
        for (const field of required) {
            const input = document.getElementById(field);
            if (input && !input.value.trim()) {
                input.focus();
                alert('请填写所有必填项');
                return false;
            }
        }
        
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的11位手机号');
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('请输入正确的邮箱地址');
            return false;
        }
        
        if (!agreement) {
            alert('请阅读并同意参赛协议和隐私政策');
            return false;
        }
        
        return true;
    }
    
    async function simulateSubmit(data) {
        return new Promise((resolve) => {
            console.log('提交数据:', data);
            setTimeout(resolve, 1500);
        });
    }
    
    function showSuccess(data) {
        const form = document.getElementById('registerForm');
        const successDiv = document.getElementById('formSuccess');
        
        form.style.display = 'none';
        successDiv.style.display = 'block';
        
        document.getElementById('successTeamName').textContent = data.teamName;
        document.getElementById('successProjectName').textContent = data.projectName;
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
