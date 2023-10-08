# codegenius-impsort-plugin

运行 `eslint` 对模块导入进行分组&按字母排序, 支持命令模式, 询问模式和 API 模式;

使用场景: 用于通过 `simple-import-sort` 插件来对导入模块进行排序且未直接配置插件到 `.eslintrc` 情况.

### 命令模式

```bash
# 尝试修复 src 文件夹中模块的导入顺序
codeg impsort -p ./src

# 尝试修复 src 和 components 文件夹中模块的导入顺序
codeg impsort -p ./src -p ./components
```

| 选项                      | 描述         |
| ------------------------- | ------------ |
| -p, --pattern \<pattern\> | 设置匹配规则 |
| -a, --ask                 | 启用询问模式 |

### 询问模式

```bash
# 启动询问模式
codeg impsort --ask
```

```
# 询问过程
1. 请选择需要尝试修复的文件/夹
```

### API 模式

```typescript
import { impSort } from "../src/index";

(async () => {
  await impSort(["./src"]);
})();
```

PS: 依赖 `eslint` API 模式, 依赖 `simple-import-sort` 插件的同时依旧会读取项目配置的 `.eslintignore` 和 `.eslintrc.json` 文件, 使用 `impsort` 的同时将同步进行 `fix` 检测和修复.

### 配置文件

```typescript
# 覆盖默认的 `impsort` 配置
import { defineConfig } from "code-genius";

export default defineConfig({
  commands: {
    format: {
      impsort: ["./src", "./scripts"],
    },
  },
});
```


