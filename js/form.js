/**
 * 报名表单脚本 - 对接 Cloudflare Worker API
 */
const API_BASE = 'https://ai-competition-api.janesmitheer.workers.dev';

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
 * 文件上传（目前仅做本地验证，附件功能待完善）
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
        if (file) handleFile(file);
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });
    
    removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        uploadPlaceholder.style.display = 'block';
        uploadSuccess.style.display = 'none';
    });
    
    function handleFile(file) {
        if (file.size > 50 * 1024 * 1024) {
            alert('文件大小不能超过50MB');
            return;
        }
        if (!file.name.match(/\.(pdf|doc|docx|zip)$/i)) {
            alert('只支持 PDF、Word、ZIP 格式');
            return;
        }
        uploadPlaceholder.style.display = 'none';
        uploadSuccess.style.display = 'flex';
        fileName.textContent = file.name;
    }
}

/**
 * 表单提交 - 对接真实 API
 */
function initFormSubmit() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';
        
        // 收集表单数据
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // 构造 API 请求体（字段映射到多维表格）
        const payload = {
            '团队名称': data.teamName,
            '所属部门': data.department || '',
            '作品分类': mapCategory(data.category),
            '作品名称': data.projectName,
            '核心问题': data.problem || '',
            'MVP方案': data.mvp || '',
            '效果指标': '',
            '团队成员': data.members || '',
            '队长': data.leaderName,
        };
        
        try {
            const response = await fetch(`${API_BASE}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess({ teamName: data.teamName, projectName: data.projectName });
            } else {
                alert('提交失败：' + (result.error || '未知错误'));
            }
        } catch (error) {
            alert('网络错误，请检查网络后重试');
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
        }
    });
    
    function validateForm() {
        const phone = document.getElementById('leaderPhone').value;
        const email = document.getElementById('leaderEmail').value;
        const agreement = document.getElementById('agreement');
        
        if (!agreement.checked) {
            alert('请阅读并同意参赛协议和隐私政策');
            return false;
        }
        
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的11位手机号');
            return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('请输入正确的邮箱地址');
            return false;
        }
        
        return true;
    }
    
    function mapCategory(value) {
        const map = {
            'sales': '销售提效',
            'supply': '供应链优化',
            'rd': '研发辅助',
            'operation': '内部运营',
            'custom': '自拟'
        };
        return map[value] || value || '';
    }
    
    function showSuccess(data) {
        const form = document.getElementById('registerForm');
        const successDiv = document.getElementById('formSuccess');
        
        form.style.display = 'none';
        successDiv.style.display = 'block';
        
        document.getElementById('successTeamName').textContent = data.teamName;
        document.getElementById('successProjectName').textContent = data.projectName;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
