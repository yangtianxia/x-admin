# 环境配置

## `.env` 文件

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```
具体的文件使用方法参考：[环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html)

.env 文件变量配置

```.env
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

## 手动创建

1. 创建 `.env` 或 `.env.development` 配置文件
2. 拷贝 `.env.example` 文件内容至配置文件
3. 按需求修改配置

## 命令创建

Mac 命令

```base
cp .env.example .env
```

Windows 命令

```base
copy .env.example .env
```

## 配置字段

### 网站配置

- `VITE_TITLE`：网站名称

### 接口配置

- `VITE_MOCK`：mock接口配置
  - `true`: 启用
  - `false`: 禁用
- `VITE_API`：API接口地址
- `VITE_REMOTE`：远程资源地址，用于远程资源的前缀路径

### 开发配置

- `VITE_PORT`：端口号
- `VITE_PROXY_API`：API接口代理地址
- `VITE_PROXY_REMOTE`：远程资源代理地址
