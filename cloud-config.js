// 完整的云端存储系统
// 使用GitHub作为云端数据库

const GITHUB_CONFIG = {
    // GitHub用户名
    OWNER: 'opp123g',
    // 仓库名称
    REPO: 'baby-growth-tracker',
    // 数据存储路径
    DATA_PATH: 'data',
    // API基础URL
    API_BASE: 'https://api.github.com',
    // Token（用户登录时输入）
    TOKEN: null
};

// 完整的云端账号管理
class CloudAuthManager {
    constructor() {
        this.currentUser = null;
        this.accounts = null;
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

    // 从GitHub加载账号列表
    async loadAccounts() {
        try {
            const response = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_PATH}/accounts.json`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            if (response.ok) {
                const fileData = await response.json();
                const content = decodeURIComponent(escape(atob(fileData.content)));
                this.accounts = JSON.parse(content);
                this.accountsSha = fileData.sha;
                return this.accounts;
            } else if (response.status === 404) {
                // 文件不存在，创建初始结构
                this.accounts = {
                    version: '1.0',
                    lastUpdated: new Date().toISOString(),
                    accounts: []
                };
                this.accountsSha = null;
                return this.accounts;
            } else {
                throw new Error('加载账号列表失败');
            }
        } catch (error) {
            console.error('加载账号列表失败：', error);
            // 降级到本地存储
            const localAccounts = localStorage.getItem('cloud_accounts');
            if (localAccounts) {
                this.accounts = JSON.parse(localAccounts);
            } else {
                this.accounts = {
                    version: '1.0',
                    lastUpdated: new Date().toISOString(),
                    accounts: []
                };
            }
            return this.accounts;
        }
    }

    // 保存账号列表到GitHub
    async saveAccounts() {
        try {
            this.accounts.lastUpdated = new Date().toISOString();
            
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(this.accounts, null, 2))));
            const requestData = {
                message: `更新账号列表 - ${new Date().toLocaleString('zh-CN')}`,
                content: content,
                committer: {
                    name: 'Baby Growth Tracker',
                    email: 'system@babygrowth.com'
                }
            };

            if (this.accountsSha) {
                requestData.sha = this.accountsSha;
            }

            const response = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_PATH}/accounts.json`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(requestData)
                }
            );

            if (response.ok) {
                const result = await response.json();
                this.accountsSha = result.content.sha;
                
                // 同时保存到本地
                localStorage.setItem('cloud_accounts', JSON.stringify(this.accounts));
                
                return { success: true };
            } else {
                throw new Error('保存账号列表失败');
            }
        } catch (error) {
            console.error('保存账号列表失败：', error);
            // 降级到本地存储
            localStorage.setItem('cloud_accounts', JSON.stringify(this.accounts));
            return { success: true, offline: true };
        }
    }

    // 注册新用户
    async register(email, password, securityQuestion, securityAnswer, token) {
        // 设置Token
        GITHUB_CONFIG.TOKEN = token;
        
        // 加载账号列表
        await this.loadAccounts();
        
        // 检查邮箱是否已被注册
        if (this.accounts.accounts.find(acc => acc.email === email)) {
            return { success: false, message: '该邮箱已被注册' };
        }

        // 验证密码
        if (password.length < 6) {
            return { success: false, message: '密码长度至少6位' };
        }

        // 验证安全问题
        if (!securityQuestion || !securityAnswer) {
            return { success: false, message: '请设置安全问题和答案' };
        }

        // 创建用户
        const userId = 'user_' + Date.now();
        const newUser = {
            userId: userId,
            email: email,
            passwordHash: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            securityQuestion: securityQuestion,
            securityAnswerHash: this.hashPassword(securityAnswer)
        };

        // 添加到账号列表
        this.accounts.accounts.push(newUser);
        
        // 保存账号列表
        const saveResult = await this.saveAccounts();
        if (!saveResult.success) {
            return { success: false, message: '注册失败，请重试' };
        }

        // 创建用户数据目录和文件
        await this.createUserData(userId, email);

        // 设置当前用户
        this.currentUser = newUser;
        this.currentUser.token = token;
        localStorage.setItem('current_user', JSON.stringify(newUser));

        return { 
            success: true, 
            message: '注册成功',
            user: newUser,
            offline: saveResult.offline
        };
    }

    // 创建用户数据文件
    async createUserData(userId, email) {
        try {
            // 创建profile.json
            const profile = {
                userId: userId,
                email: email,
                createdAt: new Date().toISOString(),
                settings: {
                    appName: '宝贝成长记录',
                    theme: 'light'
                },
                lastSyncedAt: new Date().toISOString()
            };

            await this.uploadFile(
                `${GITHUB_CONFIG.DATA_PATH}/users/${userId}/profile.json`,
                profile,
                `创建用户资料 - ${email}`
            );

            // 创建children.json
            const children = {
                userId: userId,
                lastUpdated: new Date().toISOString(),
                children: []
            };

            await this.uploadFile(
                `${GITHUB_CONFIG.DATA_PATH}/users/${userId}/children.json`,
                children,
                `初始化孩子数据 - ${email}`
            );

            // 创建records.json
            const records = {
                userId: userId,
                lastUpdated: new Date().toISOString(),
                records: []
            };

            await this.uploadFile(
                `${GITHUB_CONFIG.DATA_PATH}/users/${userId}/records.json`,
                records,
                `初始化成长记录 - ${email}`
            );

            return { success: true };
        } catch (error) {
            console.error('创建用户数据失败：', error);
            return { success: false, error: error };
        }
    }

    // 上传文件到GitHub
    async uploadFile(path, content, message) {
        try {
            const fileContent = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
            const requestData = {
                message: message,
                content: fileContent,
                committer: {
                    name: 'Baby Growth Tracker',
                    email: 'system@babygrowth.com'
                }
            };

            const response = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(requestData)
                }
            );

            if (response.ok) {
                return { success: true };
            } else {
                throw new Error('上传文件失败');
            }
        } catch (error) {
            console.error('上传文件失败：', error);
            return { success: false, error: error };
        }
    }

    // 登录
    async login(email, password, token) {
        // 设置Token
        GITHUB_CONFIG.TOKEN = token;
        
        // 加载账号列表
        await this.loadAccounts();
        
        // 查找用户
        const user = this.accounts.accounts.find(acc => acc.email === email);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        // 验证密码
        if (user.passwordHash !== this.hashPassword(password)) {
            return { success: false, message: '密码错误' };
        }

        // 更新最后登录时间
        user.lastLoginAt = new Date().toISOString();
        await this.saveAccounts();

        // 设置当前用户
        this.currentUser = user;
        this.currentUser.token = token;
        localStorage.setItem('current_user', JSON.stringify(user));

        return { 
            success: true, 
            message: '登录成功',
            user: user
        };
    }

    // 登出
    logout() {
        this.currentUser = null;
        GITHUB_CONFIG.TOKEN = null;
        localStorage.removeItem('current_user');
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

    // 密码重置 - 第一步：验证邮箱
    async verifyEmailForReset(email) {
        await this.loadAccounts();
        
        const user = this.accounts.accounts.find(acc => acc.email === email);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        return { 
            success: true, 
            securityQuestion: user.securityQuestion,
            userId: user.userId
        };
    }

    // 密码重置 - 第二步：验证安全问题
    async verifySecurityAnswer(userId, answer) {
        const user = this.accounts.accounts.find(acc => acc.userId === userId);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        if (user.securityAnswerHash !== this.hashPassword(answer)) {
            return { success: false, message: '安全问题答案错误' };
        }

        return { success: true, message: '验证成功' };
    }

    // 密码重置 - 第三步：设置新密码
    async resetPassword(userId, newPassword) {
        const user = this.accounts.accounts.find(acc => acc.userId === userId);
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: '密码长度至少6位' };
        }

        // 更新密码
        user.passwordHash = this.hashPassword(newPassword);
        user.lastLoginAt = new Date().toISOString();
        
        // 保存
        await this.saveAccounts();

        return { success: true, message: '密码重置成功' };
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

// 完整的云端数据管理
class CloudDataManager {
    constructor(authManager) {
        this.authManager = authManager;
    }

    // 获取GitHub API请求头
    getHeaders() {
        return this.authManager.getHeaders();
    }

    // 加载用户数据
    async loadUserData(userId) {
        try {
            // 加载孩子数据
            const childrenResponse = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_PATH}/users/${userId}/children.json`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            let children = [];
            if (childrenResponse.ok) {
                const fileData = await childrenResponse.json();
                const content = decodeURIComponent(escape(atob(fileData.content)));
                const childrenData = JSON.parse(content);
                children = childrenData.children || [];
            }

            // 加载记录数据
            const recordsResponse = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${GITHUB_CONFIG.DATA_PATH}/users/${userId}/records.json`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            let records = [];
            if (recordsResponse.ok) {
                const fileData = await recordsResponse.json();
                const content = decodeURIComponent(escape(atob(fileData.content)));
                const recordsData = JSON.parse(content);
                records = recordsData.records || [];
            }

            return { 
                success: true, 
                children: children, 
                records: records 
            };
        } catch (error) {
            console.error('加载用户数据失败：', error);
            // 从本地加载
            const localChildren = localStorage.getItem(`children_${userId}`);
            const localRecords = localStorage.getItem(`records_${userId}`);
            
            return { 
                success: true, 
                children: localChildren ? JSON.parse(localChildren) : [], 
                records: localRecords ? JSON.parse(localRecords) : [],
                offline: true
            };
        }
    }

    // 保存用户数据
    async saveUserData(userId, children, records) {
        try {
            // 保存孩子数据
            const childrenData = {
                userId: userId,
                lastUpdated: new Date().toISOString(),
                children: children
            };

            await this.uploadFile(
                `${GITHUB_CONFIG.DATA_PATH}/users/${userId}/children.json`,
                childrenData,
                `更新孩子数据 - ${new Date().toLocaleString('zh-CN')}`
            );

            // 保存记录数据
            const recordsData = {
                userId: userId,
                lastUpdated: new Date().toISOString(),
                records: records
            };

            await this.uploadFile(
                `${GITHUB_CONFIG.DATA_PATH}/users/${userId}/records.json`,
                recordsData,
                `更新成长记录 - ${new Date().toLocaleString('zh-CN')}`
            );

            // 同时保存到本地
            localStorage.setItem(`children_${userId}`, JSON.stringify(children));
            localStorage.setItem(`records_${userId}`, JSON.stringify(records));

            return { success: true };
        } catch (error) {
            console.error('保存用户数据失败：', error);
            // 降级到本地存储
            localStorage.setItem(`children_${userId}`, JSON.stringify(children));
            localStorage.setItem(`records_${userId}`, JSON.stringify(records));
            return { success: true, offline: true };
        }
    }

    // 上传文件
    async uploadFile(path, content, message) {
        // 先获取文件的SHA（如果存在）
        let sha = null;
        try {
            const response = await fetch(
                `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${path}`,
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

        // 上传文件
        const fileContent = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
        const requestData = {
            message: message,
            content: fileContent,
            committer: {
                name: 'Baby Growth Tracker',
                email: 'system@babygrowth.com'
            }
        };

        if (sha) {
            requestData.sha = sha;
        }

        const response = await fetch(
            `${GITHUB_CONFIG.API_BASE}/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/contents/${path}`,
            {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(requestData)
            }
        );

        if (response.ok) {
            return { success: true };
        } else {
            throw new Error('上传文件失败');
        }
    }

    // 导出所有数据
    async exportAllData(userId) {
        const user = this.authManager.getCurrentUser();
        if (!user) {
            return { success: false, message: '请先登录' };
        }

        const userData = await this.loadUserData(userId);
        
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            account: {
                email: user.email,
                createdAt: user.createdAt,
                securityQuestion: user.securityQuestion
            },
            children: userData.children,
            records: userData.records
        };

        return { success: true, data: exportData };
    }

    // 导入数据
    async importAllData(userId, importData) {
        if (!importData.children || !importData.records) {
            return { success: false, message: '数据格式错误' };
        }

        // 保存数据
        const result = await this.saveUserData(userId, importData.children, importData.records);
        
        return result;
    }
}

// 创建全局实例
const cloudAuthManager = new CloudAuthManager();
const cloudDataManager = new CloudDataManager(cloudAuthManager);
