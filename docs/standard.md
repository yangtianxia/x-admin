# standard

## TSX

### 组件规范  
使用组件时按照如何规范书写

- 布尔值属性
- 文本值属性
- 其它属性
- `v-` 指令属性

```tsx
<FormItem
  validateFirst
  name="password"
>
  <Input.Password
    visibilityToggle
    placeholder="登录密码"
    prefix={<Icon type="Lock" />}
    v-model:value={formModel.password}
  />
</FormItem>
```
