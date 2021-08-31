## 功能

- [x] 热加载
- [x] Swagger 构建 API 文档
- [ ] 数据库模块：TypeORM
- [ ] 日志模块：winston
- [ ] 用户身份验证：JWT
- [ ] 文件上传模块
- [ ] WebSocket 实时数据传输
- [ ] Task Scheduling 定时推送
- [ ] 单元测试
- [x] 代码提交格式限制

#### Swagger API 文档

```bash
# 安装插件
pnpm install @nestjs/swagger swagger-ui-express
```

```javascript
// main.ts
// 接口文档 swagger 参数
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  // ...省略内容
  const options = new DocumentBuilder()
    .setTitle('工作流 app')
    .setDescription('API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 设置 swagger 网址
  SwaggerModule.setup('docs', app, document);
  await app.listen(port);
}
```

#### 热加载

```bash
# 安装插件
pnpm install --save-dev webpack-node-externals run-script-webpack-plugin webpack

# package.json 配置 scripts
scripts:{
  "start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch"
}

# 启动
npm run start:dev
```

```javascript
// main.ts
declare const module: any;
async function bootstrap() {
  // ...省略内容
  await app.listen(port);
  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

// 新建文件webpack-hmr.config.js
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename }),
    ],
  };
};
```

#### 规范提交格式

```bash
# git add . 警告（warning: LF will be replaced by CRLF in）
git config --global core.autocrlf false
# 插件安装
pnpm install --save-dev husky@4.3.8 @commitlint/cli @commitlint/config-conventional lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "{src,test}/**/*.{js,ts,tsx,jsx}": ["prettier --write", "eslint --fix"]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS "
    }
  }
}
```

```javascript
// 新建commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // 构建执行
        'chore', // 构建工具相关
        'ci', // CI 相关
        'docs', // 文档更新
        'feat', // 新功能
        'fix', // bug 修复
        'perf', // 性能优化
        'refactor', // 功能重构
        'release', // 大版本更新
        'revert', // 回滚操作
        'style', // 样式变动
        'test', // 单元测试
        'upd', // 普通功能更新
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
};
```

## Installation

```bash
$ pnpm | npm | yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
