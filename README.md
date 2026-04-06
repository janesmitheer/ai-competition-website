# AI大赛报名网站

静态网站，使用纯 HTML/CSS/JS 开发，可部署到 GitHub Pages。

## 页面

- `index.html` - 首页（大赛介绍、时间线、奖金说明）
- `register.html` - 报名表单
- `status.html` - 报名状态查询

## 部署到 GitHub Pages

### 方法1：手动部署

1. 在 GitHub 创建新仓库（如 `ai-competition-website`）
2. 将本目录所有文件推送到仓库
3. 进入仓库 Settings → Pages
4. Source 选择 `main` branch 和 `/ (root)` 文件夹
5. 点击 Save，等待部署完成
6. 访问 `https://你的用户名.github.io/ai-competition-website/`

### 方法2：使用 GitHub CLI

```bash
# 创建仓库并推送
gh repo create ai-competition-website --public --push

# 启用 Pages
gh repo view ai-competition-website --json websiteUrl
```

## 本地预览

直接用浏览器打开 `index.html` 即可预览。

## 待开发

- [ ] 表单数据提交到后端 API
- [ ] 报名状态查询对接数据库
- [ ] 投票功能页面
- [ ] 评审管理后台
