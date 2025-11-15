# Web 平台支持说明

## 问题

SQLite 数据库在 Web 平台上不可用，会导致以下错误：
```
TypeError: _ExpoSQLiteNext.default.NativeDatabase is not a constructor
```

## 解决方案

实现了平台适配层，在 Web 平台自动降级到 localStorage：

### 1. 创建 Web 存储适配器

**文件**: `src/services/webStorage.ts`

- 使用 localStorage 持久化数据
- 提供与 SQLite 相同的 API 接口
- 支持完整的 CRUD 操作
- 自动初始化默认类别

### 2. 更新数据库服务

**文件**: `src/services/database.ts`

在所有数据库操作中添加平台检测：
```typescript
if (!isSQLiteSupported()) {
  // 使用 webStorage
  return await WebStorage.xxx();
}
// 使用 SQLite
```

## 平台差异

### SQLite (iOS/Android)
- ✅ 关系型数据库
- ✅ 索引优化
- ✅ 外键约束
- ✅ 事务支持
- ✅ 大数据量性能优秀

### localStorage (Web)
- ✅ 浏览器原生支持
- ✅ 持久化存储
- ⚠️ 无索引（内存排序/筛选）
- ⚠️ 无外键约束
- ⚠️ 单线程同步操作
- ⚠️ 存储限制（通常 5-10MB）

## 功能支持

### ✅ 完全支持的功能

1. **键盘输入记账**
   - ✅ 表单输入
   - ✅ 类别选择
   - ✅ 数据保存
   - ✅ 列表展示

2. **数据持久化**
   - ✅ 刷新页面数据不丢失
   - ✅ 支出记录保存
   - ✅ 默认类别加载

3. **主题系统**
   - ✅ 深色模式
   - ✅ 响应式布局

### ⚠️ 部分支持的功能

1. **语音输入**
   - ✅ UI 组件正常显示
   - ⚠️ Web Speech API 需浏览器支持
   - ⚠️ Chrome/Edge 支持较好
   - ❌ Safari/Firefox 支持有限

2. **OCR 识别**
   - ❌ 相机访问受限
   - ⚠️ 文件上传可替代

### ❌ 不支持的功能

1. **原生相机**
   - ❌ expo-camera 不支持 Web

2. **文件系统**
   - ❌ expo-file-system 不支持 Web

## 使用建议

### 开发测试

**Web 平台**（快速迭代）:
```bash
npm start -- --web
# 或
npx expo start --web
```

**移动平台**（完整功能）:
```bash
npm start
# 然后按 'a' (Android) 或 'i' (iOS)
```

### 生产部署

1. **Web 应用**: 适合基础记账功能
   - 部署到 Vercel/Netlify
   - 无需应用商店审核
   - 跨平台访问

2. **移动应用**: 完整功能体验
   - 部署到 App Store/Google Play
   - 支持语音/拍照识别
   - 离线功能完善

## 数据迁移

如果用户从 Web 切换到移动应用：

1. **导出功能**（待实现）
   - 从 localStorage 导出 JSON
   - 通过 API 上传到云端

2. **导入功能**（待实现）
   - 移动端从云端下载
   - 导入到 SQLite

## 性能考虑

### Web 平台优化

1. **数据量限制**
   - 建议 < 1000 条记录
   - 超出后考虑分页加载

2. **查询优化**
   - 使用日期范围筛选
   - 避免全量加载

3. **缓存策略**
   - 类别数据缓存
   - 常用查询结果缓存

## 浏览器兼容性

### ✅ 推荐浏览器

- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 88+

### 功能支持表

| 功能 | Chrome | Edge | Safari | Firefox |
|------|--------|------|--------|---------|
| 基础记账 | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Web Speech API | ✅ | ✅ | ⚠️ | ⚠️ |
| 深色模式 | ✅ | ✅ | ✅ | ✅ |

## 故障排除

### 数据丢失

检查浏览器设置：
- 禁用"清除浏览数据"
- 允许 localStorage
- 不使用无痕模式

### 语音识别失败

1. 检查麦克风权限
2. 使用 Chrome/Edge 浏览器
3. 确保 HTTPS 连接（localhost 除外）

### 性能问题

1. 清理旧数据
2. 限制日期范围
3. 使用分页加载

## 测试

启动 Web 服务器后访问 http://localhost:8081

**推荐测试流程**:
1. ✅ 输入金额、选择类别、保存
2. ✅ 刷新页面验证数据持久化
3. ✅ 查看支出列表
4. ✅ 切换深色/浅色模式
5. ⚠️ 测试语音输入（Chrome）

## 已修复的问题

- ✅ SQLite 初始化错误
- ✅ 平台兼容性问题
- ✅ 数据持久化
- ✅ 默认类别加载

现在可以在 Web 浏览器中正常使用基础记账功能！
