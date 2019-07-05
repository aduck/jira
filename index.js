// 拿到数据 -> 导出excel
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const moment = require('moment')
const {users, cookie, pullStatus = 'DEV IN PROGRESS', firstDayOfWeek = 1, lastDayOfWeek = 5} = require('./conf')
const analysis = require('./analysis')
const convert = require('./convert')

// 获取所有issue
const getAllData = () => {
  return axios({
    url: 'http://jira.yit.com/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=17&selectedProjectKey=BOSS',
    method: 'get',
    headers: {'Cookie': cookie}
  })
}
// 对照表，仅仅用来生成文件名的
const statusMap = {
  'DEV IN PROGRESS': '计划',
  'Dev Resolved': '总结'
}

// main
;(async () => {
  // 输出文件夹
  if (!fs.existsSync('./temp')) fs.mkdirSync('temp')
  const {status, data = {}} = await getAllData()
  if (status !== 200) throw new Error(`> 数据获取失败,code:${status}`)
  console.log('> 数据拉取成功')
  // 所有issue
  let allIssues = data.issuesData.issues
  // 拿到周区间
  let isLastday = moment().day() === lastDayOfWeek
  let weekStart, weekEnd
  if (pullStatus === 'Dev Resolved') {
    // 拉已完成的任务，说明是本周
    weekStart = moment().day(firstDayOfWeek).format('YYYYMMDD')
    weekEnd = moment().day(lastDayOfWeek).format('YYYYMMDD')
  } else if (pullStatus === 'DEV IN PROGRESS') {
    // 拉计划，如果是最后一天说明是下周，不是周五就是本周
    weekStart = moment().day(isLastday ? 7 + firstDayOfWeek : firstDayOfWeek).format('YYYYMMDD')
    weekEnd = moment().day(isLastday ? 7 + lastDayOfWeek : lastDayOfWeek).format('YYYYMMDD')
  }
  let weekRange = `${moment(weekStart).format('MM/DD')}-${moment(weekEnd).format('MM/DD')}`
  // 最终结果是类型为任务或者story
  let bossIssues = allIssues.reduce((prev, cur) => {
    const {key, summary, typeName, statusName, assignee, estimateStatistic = {}} = cur
    // 筛选
    let validUsers = Object.keys(users)
    if (!validUsers.includes(assignee) || !['Story', '任务'].includes(typeName) || statusName !== pullStatus) return prev
    let point = estimateStatistic.statFieldValue.value
    let userName = users[assignee].cn
    let day = users[assignee].day
    prev[userName] = !prev[userName] ? [{key, summary, status: statusName, assignee, userName, day, point, weekStart, weekEnd, weekRange, note: statusMap[pullStatus]}] : prev[userName].concat([{key, summary, status: statusName, assignee, userName, day, point, weekStart, weekEnd, weekRange, note: statusMap[pullStatus]}])
    return prev
  }, {})
  let fileName = `${weekStart}-${weekEnd}_${statusMap[pullStatus]}.json`
  fs.writeFile(path.join(__dirname, 'temp', fileName), JSON.stringify(bossIssues), 'utf8', err => {
    if (err) throw err
    console.log(`> 文件/temp/${fileName}已生成`)
  })
  // 做个分析
  analysis(bossIssues)
  // 导出
  convert(bossIssues)
})()