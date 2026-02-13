// GitHub云端存储配置
// 使用GitHub API存储数据到您的仓库

const GITHUB_CONFIG = {
    // GitHub用户名
    OWNER: 'opp123g',
    // 仓库名称
    REPO: 'baby-growth-tracker',
    // 数据文件路径
    DATA_FILE: 'data/user_data.json',
    // API基础URL
    API_BASE: 'https://api.github.com',
    // Token（用户登录时输入）
    TOKEN: null
};

// 用户认证管理
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    // 加载用户列表
    loadUsers() {
        const users = localStorage.getItem('cloud_users');
        return users ? JSON.parse(users) : {};
    }

    // 保存用户列表
    saveUsers() {
        localStorage.setItem('cloud_users', JSON.stringify(this.users));
    }

    // 注册新用户
    register(email, password, token) {
        if (this.users[email]) {
            return { success: false, message: '该邮箱已被注册' };
        }

        if (password.length < 6) {
            return { success: false, message: '密码长度至少6位' };
        }

        if (!token || token.length < 10) {
            return { success: false, message: '请输入有效的GitHub Token' };
        }

        // 创建用户
        const userId = 'user_' + Date.now();
        this.users[email] = {
            id: userId,
            email: email,
            password: this.hashPassword(password),
            token: token,
            createdAt: new Date().toISOString()
        };

        this.saveUsers();
        
        // 设置全局Token
        GITHUB_CONFIG.TOKEN = token;
        
        return { success: true, message: '注册成功', userId: userId };
    }

    // 登录
    login(email, password) {
        const user = this.users[email];
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: '密码错误' };
        }

        this.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        
        // 设置全局Token
        GITHUB_CONFIG.TOKEN = user.token;
        
        return { success: true, message: '登录成功', user: user };
    }

    // 登出
    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        GITHUB_CONFIG.TOKEN = null;
    }

    // 获取当前用户
    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                // 恢复Token
                if (this.currentUser.token) {
                    GITHUB_CONFIG.TOKEN = this.currentUser.token;
                }
            }
        }
        return this.currentUser;
    }

    // 简单的密码哈希
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
}

// GitHub云端数据管理
class CloudDataManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.cache = {};
    }

    // 获取GitHub API请求头
    getHeaders() {
        if (!GITHUB_CONFIG.TOKEN) {
            throw new Error('未设置GitHub Token');
        }
        
        return {
            'Authorization': `token ${GITHUB_CONFIG.TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    // 保存数据到GitHub
    async saveData(data) {
        const user = this.authManager.getCurrentUser();
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        try {
            // 准备数据
            const userData = {
                userId: user.id,
                email: user.email,
                data: data,
                updatedAt: new Date().toISOString()
            };

            // 获取当前文件信息（如果存在）
            let sha = null;
            try {
                const response = await fetch(
                    `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_FILE}`,
                    {
                        method: 'GET',
                        headers: this.getHeaders()
                    }
                );

                if (response.ok) {
                    const fileData = await response.json();
                    sha = fileData.sha;
                }
            } catch (error) {
                // 文件不存在，继续创建
            }

            // 准备GitHub API请求
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(userData, null, 2))));
            const requestData = {
                message: `更新数据 - ${new Date().toLocaleString('zh-CN')}`,
                content: content,
                committer: {
                    name: user.email,
                    email: user.email
                }
            };

            // 如果文件存在，添加sha
            if (sha) {
                requestData.sha = sha;
            }

            // 保存到GitHub
            const response = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_FILE}`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(requestData)
                }
            );

            if (response.ok) {
                // 同时保存到本地
                this.saveToLocalStorage(user.id, data);
                return { success: true, message: '数据已保存到GitHub云端' };
            } else {
                throw new Error('GitHub API请求失败');
            }
        } catch (error) {
            console.error('GitHub保存失败：', error);
            // 降级到本地存储
            const user = this.authManager.getCurrentUser();
            if (user) {
                this.saveToLocalStorage(user.id, data);
            }
            return { success: true, message: '数据已保存到本地（离线模式）' };
        }
    }

    // 从GitHub加载数据
    async loadData() {
        const user = this.authManager.getCurrentUser();
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        try {
            // 从GitHub加载
            const response = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_FILE}`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            if (response.ok) {
                const fileData = await response.json();
                const content = decodeURIComponent(escape(atob(fileData.content)));
                const userData = JSON.parse(content);

                if (userData.data) {
                    // 保存到本地
                    this.saveToLocalStorage(user.id, userData.data);
                    return { success: true, data: userData.data };
                }
            }

            // 如果GitHub加载失败，从本地加载
            const localData = this.loadFromLocalStorage(user.id);
            return { success: true, data: localData };
        } catch (error) {
            console.error('GitHub加载失败：', error);
            // 从本地加载
            const localData = this.loadFromLocalStorage(user.id);
            return { success: true, data: localData };
        }
    }

    // 保存到本地存储
    saveToLocalStorage(userId, data) {
        localStorage.setItem(`cloud_data_${userId}`, JSON.stringify(data));
    }

    // 从本地存储加载
    loadFromLocalStorage(userId) {
        const data = localStorage.getItem(`cloud_data_${userId}`);
        return data ? JSON.parse(data) : null;
    }

    // 生成分享链接
    generateShareLink(password) {
        const user = this.authManager.getCurrentUser();
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        const shareId = 'share_' + Date.now();
        const shareData = {
            id: shareId,
            userId: user.id,
            password: this.authManager.hashPassword(password),
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };

        // 保存分享信息
        const shares = JSON.parse(localStorage.getItem('cloud_shares') || '{}');
        shares[shareId] = shareData;
        localStorage.setItem('cloud_shares', JSON.stringify(shares));

        return {
            success: true,
            shareLink: `${window.location.origin}${window.location.pathname}?share=${shareId}`,
            shareId: shareId
        };
    }

    // 访问分享数据
    async accessShareData(shareId, password) {
        const shares = JSON.parse(localStorage.getItem('cloud_shares') || '{}');
        const shareData = shares[shareId];

        if (!shareData) {
            return { success: false, message: '分享链接不存在' };
        }

        if (new Date() > new Date(shareData.expiresAt)) {
            return { success: false, message: '分享链接已过期' };
        }

        if (shareData.password !== this.authManager.hashPassword(password)) {
            return { success: false, message: '访问密码错误' };
        }

        // 加载分享的数据
        const data = this.loadFromLocalStorage(shareData.userId);
        return { success: true, data: data };
    }
}

// 创建全局实例
const authManager = new AuthManager();
const cloudDataManager = new CloudDataManager(authManager);
