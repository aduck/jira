<<<<<<< HEAD
# 用来拉jira数据统计工作量并进行分析导出

## 配置（需要新建conf.js）
=======
## 用来拉jira数据统计工作量并进行分析导出

### 配置（没有需要新建conf.js）
>>>>>>> 2e9c67e499ef92db3748743fa7a5f0983d2fbb90

```javascript
module.exports = {
  // jira里的cookie，用来登录
  cookie: '',
  // 需要统计的人员列表，格式为{'en': {cn: '', day: ''}}
  users: {},
  // 拉取状态，枚举['DEV IN PROGRESS'(计划任务), 'Dev Resolved'(实际完成)]
<<<<<<< HEAD
  pullStatus: '',
  // 每周第一个工作日，默认周一
  firstDayOfWeek: 1,
  // 每周最后一个工作日，默认是周五
  lastDayOfWeek: 5
}
```

## 命令
=======
  pullStatus: ''
}
```

### 命令
>>>>>>> 2e9c67e499ef92db3748743fa7a5f0983d2fbb90

```bash
npm start # 一步到位
npm run analyse ./xxx.json # 分析工作量
npm run convert ./xxx.json # 把json导出为excel
<<<<<<< HEAD
```

## TODOS

* 整合计划和总结，生成一个xlsx
* xlsx样式优化
=======
```
>>>>>>> 2e9c67e499ef92db3748743fa7a5f0983d2fbb90
