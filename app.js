// 文档数据结构
const docs = {
    "quick_start": {
        title: "快速开始",
        icon: "fa-rocket",
        items: [
            { path: "quick_start/quick_start", title: "快速开始", titleEn: "Quick Start" },
            { path: "quick_start/basics_tutorial", title: "基础教程", titleEn: "Basics Tutorial" },
            { path: "quick_start/benchmark", title: "性能测试", titleEn: "Benchmark" }
        ]
    },
    "user_guide": {
        title: "用户指南",
        icon: "fa-book-open",
        items: [
            { path: "user_guide/framework_conf", title: "框架配置", titleEn: "Framework Configuration" },
            { path: "user_guide/timeout_control", title: "超时控制", titleEn: "Timeout Control" },
            { path: "user_guide/metadata_transmission", title: "链路透传", titleEn: "Metadata Transmission" },
            { path: "user_guide/reverse_proxy", title: "反向代理", titleEn: "Reverse Proxy" },
            { path: "user_guide/graceful_restart", title: "优雅重启", titleEn: "Graceful Restart" },
            { path: "user_guide/attachment", title: "附件传输", titleEn: "Attachment" },
            { path: "user_guide/testing", title: "测试", titleEn: "Testing" },
            { path: "user_guide/tnet", title: "Tnet", titleEn: "Tnet" }
        ]
    },
    "user_guide_server": {
        title: "用户指南 - 服务端",
        icon: "fa-server",
        items: [
            { path: "user_guide/server/overview", title: "服务端概览", titleEn: "Server Overview" },
            { path: "user_guide/server/flatbuffers", title: "Flatbuffers", titleEn: "Flatbuffers" }
        ]
    },
    "user_guide_client": {
        title: "用户指南 - 客户端",
        icon: "fa-laptop-code",
        items: [
            { path: "user_guide/client/overview", title: "客户端概览", titleEn: "Client Overview" },
            { path: "user_guide/client/connection_mode", title: "连接模式", titleEn: "Connection Mode" },
            { path: "user_guide/client/flatbuffers", title: "Flatbuffers", titleEn: "Flatbuffers" }
        ]
    },
    "developer_guide": {
        title: "开发者指南",
        icon: "fa-code",
        items: [
            { path: "developer_guide/develop_plugins/protocol", title: "Protocol 插件", titleEn: "Protocol Plugin" },
            { path: "developer_guide/develop_plugins/naming", title: "Naming 插件", titleEn: "Naming Plugin" },
            { path: "developer_guide/develop_plugins/config", title: "Config 插件", titleEn: "Config Plugin" },
            { path: "developer_guide/develop_plugins/log", title: "Log 插件", titleEn: "Log Plugin" },
            { path: "developer_guide/develop_plugins/metrics", title: "Metrics 插件", titleEn: "Metrics Plugin" },
            { path: "developer_guide/develop_plugins/database", title: "Database 插件", titleEn: "Database Plugin" }
        ]
    }
};

// 当前语言
let currentLang = 'zh';

// 当前文档路径
let currentDocPath = '';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initEventListeners();
    initMarked();
    
    // 检查 URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
        loadDocument(hash);
    }
});

// 初始化 Marked 配置
function initMarked() {
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
}

// 初始化导航菜单
function initNavigation() {
    const navMenu = document.getElementById('navMenu');
    let html = '';
    
    for (const [key, category] of Object.entries(docs)) {
        html += `
            <div class="nav-category" data-category="${key}">
                <div class="nav-category-title">
                    <i class="fas fa-chevron-down"></i>
                    <i class="fas ${category.icon}"></i>
                    <span>${category.title}</span>
                </div>
                <div class="nav-items">
                    ${category.items.map(item => `
                        <a href="#${item.path}" class="nav-item" data-path="${item.path}">
                            ${currentLang === 'zh' ? item.title : item.titleEn}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    navMenu.innerHTML = html;
    
    // 添加分类折叠功能
    document.querySelectorAll('.nav-category-title').forEach(title => {
        title.addEventListener('click', () => {
            title.parentElement.classList.toggle('collapsed');
        });
    });
}

// 初始化事件监听
function initEventListeners() {
    // 导航项点击
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-item') || e.target.closest('.nav-item')) {
            const item = e.target.classList.contains('nav-item') ? e.target : e.target.closest('.nav-item');
            const path = item.dataset.path;
            if (path) {
                e.preventDefault();
                loadDocument(path);
                window.location.hash = path;
                
                // 移动端关闭侧边栏
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            }
        }
        
        // 快速链接点击
        if (e.target.classList.contains('link-card') || e.target.closest('.link-card')) {
            const card = e.target.classList.contains('link-card') ? e.target : e.target.closest('.link-card');
            const docPath = card.dataset.doc;
            if (docPath) {
                e.preventDefault();
                loadDocument(docPath);
                window.location.hash = docPath;
            }
        }
    });
    
    // 移动端菜单按钮
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
    
    // 语言切换
    document.getElementById('langBtn').addEventListener('click', () => {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        document.getElementById('currentLang').textContent = currentLang === 'zh' ? '中文' : 'English';
        
        // 重新加载当前文档
        if (currentDocPath) {
            loadDocument(currentDocPath);
        }
        
        // 更新导航菜单
        updateNavigationLanguage();
    });
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterNavigation(query);
    });
    
    // 返回顶部
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 更新导航语言
function updateNavigationLanguage() {
    document.querySelectorAll('.nav-item').forEach(item => {
        const path = item.dataset.path;
        for (const category of Object.values(docs)) {
            const doc = category.items.find(d => d.path === path);
            if (doc) {
                item.textContent = currentLang === 'zh' ? doc.title : doc.titleEn;
                break;
            }
        }
    });
}

// 过滤导航
function filterNavigation(query) {
    if (!query) {
        document.querySelectorAll('.nav-category').forEach(cat => {
            cat.style.display = 'block';
            cat.classList.remove('collapsed');
        });
        document.querySelectorAll('.nav-item').forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    document.querySelectorAll('.nav-category').forEach(category => {
        let hasVisibleItems = false;
        const items = category.querySelectorAll('.nav-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        if (hasVisibleItems) {
            category.style.display = 'block';
            category.classList.remove('collapsed');
        } else {
            category.style.display = 'none';
        }
    });
}

// 加载文档
async function loadDocument(path) {
    currentDocPath = path;
    
    // 更新活动状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.path === path) {
            item.classList.add('active');
        }
    });
    
    // 确定文件路径
    const suffix = currentLang === 'zh' ? '.zh_CN.md' : '.md';
    const filePath = `/${path}${currentLang === 'zh' && !path.includes('.zh_CN') ? suffix : '.md'}`;
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // 如果中文文件不存在，尝试加载英文版本
            if (currentLang === 'zh') {
                const enResponse = await fetch(`/${path}.md`);
                if (enResponse.ok) {
                    const markdown = await enResponse.text();
                    renderMarkdown(markdown);
                    return;
                }
            }
            throw new Error('Document not found');
        }
        
        const markdown = await response.text();
        renderMarkdown(markdown);
    } catch (error) {
        console.error('Error loading document:', error);
        showError('文档加载失败，请稍后重试。');
    }
}

// 渲染 Markdown
function renderMarkdown(markdown) {
    const content = document.getElementById('markdownContent');
    const html = marked.parse(markdown);
    content.innerHTML = html;
    
    // 代码高亮
    content.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    // 处理图片加载错误
    content.querySelectorAll('img').forEach((img) => {
        img.addEventListener('error', function() {
            // 创建一个占位符容器
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px;
                    padding: 40px 20px;
                    text-align: center;
                    color: white;
                    margin: 20px 0;
                ">
                    <i class="fas fa-image" style="font-size: 48px; margin-bottom: 16px; opacity: 0.8;"></i>
                    <p style="margin: 0; font-size: 16px; font-weight: 500;">图片暂时无法显示</p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.8;">${this.alt || '图片加载失败'}</p>
                </div>
            `;
            this.parentNode.replaceChild(placeholder, this);
        });
    });
    
    // 生成目录
    generateTOC();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 生成目录
function generateTOC() {
    const content = document.getElementById('markdownContent');
    const tocNav = document.getElementById('tocNav');
    const headings = content.querySelectorAll('h1, h2, h3');
    
    if (headings.length === 0) {
        tocNav.innerHTML = '<p style="color: var(--text-secondary); font-size: 12px;">暂无目录</p>';
        return;
    }
    
    let html = '';
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        
        html += `<a href="#${id}" class="toc-${level}" data-id="${id}">${text}</a>`;
    });
    
    tocNav.innerHTML = html;
    
    // 目录点击事件
    tocNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.id;
            const target = document.getElementById(targetId);
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // 滚动高亮
    window.addEventListener('scroll', updateTOCHighlight);
}

// 更新目录高亮
function updateTOCHighlight() {
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const tocLinks = document.querySelectorAll('.toc-nav a');
    
    let currentHeading = null;
    headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
            currentHeading = heading;
        }
    });
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (currentHeading && link.dataset.id === currentHeading.id) {
            link.classList.add('active');
        }
    });
}

// 显示错误
function showError(message) {
    const content = document.getElementById('markdownContent');
    content.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <i class="fas fa-exclamation-circle" style="font-size: 64px; color: var(--warning-color); margin-bottom: 20px;"></i>
            <h2 style="color: var(--text-color); margin-bottom: 12px;">出错了</h2>
            <p style="color: var(--text-secondary);">${message}</p>
        </div>
    `;
}

export { loadDocument, docs };
