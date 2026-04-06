/**
 * 首页主脚本
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化粒子动画
    initParticleAnimation();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化导航高亮
    initNavigationHighlight();
});

/**
 * 粒子动画
 */
function initParticleAnimation() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // CSS动画已由particles.js处理
}

/**
 * 滚动动画
 */
function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .track-card, .award-card, .timeline-item, .scoring-item');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !el.classList.contains('animated')) {
                el.classList.add('animated');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    
    // 初始化元素状态
    const elements = document.querySelectorAll('.feature-card, .track-card, .award-card, .timeline-item, .scoring-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查
}

/**
 * 导航高亮
 */
function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightNav);
}

/**
 * 表单提交处理（演示用）
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // 验证必填字段
    const required = ['teamName', 'department', 'category', 'projectName', 'coreProblem', 'leaderName', 'leaderPhone', 'leaderEmail'];
    for (const field of required) {
        if (!data[field]) {
            alert('请填写所有必填项');
            return;
        }
    }
    
    // 手机号验证
    if (!/^1[3-9]\d{9}$/.test(data.leaderPhone)) {
        alert('请输入正确的手机号');
        return;
    }
    
    // 邮箱验证
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.leaderEmail)) {
        alert('请输入正确的邮箱');
        return;
    }
    
    // 这里可以发送到后端API
    console.log('提交数据:', data);
    
    // 演示：显示成功信息
    showFormSuccess(data);
}

/**
 * 显示表单成功
 */
function showFormSuccess(data) {
    const form = document.getElementById('registerForm');
    const successDiv = document.getElementById('formSuccess');
    
    if (form && successDiv) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        
        document.getElementById('successTeamName').textContent = data.teamName;
        document.getElementById('successProjectName').textContent = data.projectName;
    }
}

/**
 * 文件上传处理
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
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed'];
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|zip)$/i)) {
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

// 导出函数供其他脚本使用
window.handleFormSubmit = handleFormSubmit;
window.initFileUpload = initFileUpload;
window.initCharCount = initCharCount;
