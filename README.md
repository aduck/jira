# 用来拉jira数据统计工作量并进行分析导出

## 配置（需要新建conf.js）

```javascript
module.exports = {
  // jira里的cookie，用来登录
  cookie: '',
  // 需要统计的人员列表，格式为{'en': {cn: '', day: ''}}
  users: {},
  // 拉取状态，枚举['DEV IN PROGRESS'(计划任务), 'Dev Resolved'(实际完成)]
  pullStatus: '',
  // 每周第一个工作日，默认周一
  firstDayOfWeek: 1,
  // 每周最后一个工作日，默认是周五
  lastDayOfWeek: 5
}
```

## 命令

```bash
npm start # 一步到位
npm run analyse ./xxx.json # 分析工作量
npm run convert ./xxx.json # 把json导出为excel
```

## TODOS

* 整合计划和总结，生成一个xlsx
* xlsx样式优化
