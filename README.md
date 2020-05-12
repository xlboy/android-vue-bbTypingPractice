# android-vue-bbTypingPractice

基于 vue-cli4.0 + webpack 4 + element ui + sass+ rem 适配方案+axios 封装构建的一款手机端打字练习软件，一款为五笔、音形用户而生的打字机。

[点击BB机安卓版](http://xlboy.cn/article/5e7865d7d453277ee93134a0)

### 功能篇

## 实时
- √ 速度测试
- √ 击键测试
- √ 码长测试
## 自动
- √ 自动发送练习成绩至QQ群
- √ 自动读取QQ群中练习文章
- √ 自动分享所练习文章内容
## 词提
- √ 内置多种词库
- √ 同步上传词库至用户词库
- √ 同步自定义词提颜色
## 统计
- √ 同步练习字数
- √ 同步练习成绩
- √ 可视化成绩成长图


### 启动项目

```bash

git clone https://github.com/xlboy/android-vue-bbTypingPractice.git

cd android-vue-bbTypingPractice

npm install

npm run serve
```

### <span id="env">✅ 配置多环境变量 </span>

`package.json` 里的 `scripts` 配置 `serve` `stage` `build`，通过 `--mode xxx` 来执行不同环境

- 通过 `npm run serve` 启动本地 , 执行 `development`
- 通过 `npm run stage` 打包测试 , 执行 `staging`
- 通过 `npm run build` 打包正式 , 执行 `production`

