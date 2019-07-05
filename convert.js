const fs = require('fs')
const util = require('util')
const XLSX = require('xlsx')
const readFile = util.promisify(fs.readFile)
/**
 * 导出到excel
 * @param target 可以是path或者Object
 */
const convert = async target => {
  if (!target) throw new Error('> 缺少必要参数')
  let data = typeof target === 'string' ? JSON.parse(await readFile(target)): target
  console.log('> 开始导出...')
  // 处理下数据
  let firstData = (Object.values(data || {})[0] || [])[0]
  if (!firstData) return console.log('没有找到数据')
  const {weekStart, weekEnd, note, status} = firstData
  let result = Object.values(data).reduce((prev, cur) => prev.concat(cur) ,[]).map(v => {
    return {
      '时间': v.weekRange,
      '人员': v.userName,
      '本周实际工作日': v.day,
      '本周任务': v.summary,
      'JIRA ID': v.key,
      'story point': v.point,
      '实际完成': status === 'Dev Resolved' ? v.point : '',
      '遇到问题': ''
    }
  })
  // 生成worksheet
  let ws = XLSX.utils.json_to_sheet(result)
  // 合并单元格，返回格式[2, 8, 4 ...]
  let colsB = Object.keys(ws).filter(v => v.indexOf('B') === 0)
  let margeData = colsB.reduce((prev, cur, i) => {
    let lastVal = i === 0 ?  '' : ws[colsB[i - 1]].v
    let curVal = ws[cur].v
    if (curVal !== lastVal) {
      prev.push(1)
    } else {
      let prevLastVal = prev[prev.length - 1]
      prev[prev.length - 1] = prevLastVal + 1
    }
    return prev
  }, [])
  let colBStartAt = 1
  let colCStartAt = 1
  // 构造合并数据[{s: {c: 0, r: 1}, e: {c: 0, r: 2}}]
  let colAMergeData = [
    {
      s: {c: 0, r: 1},
      e: {c: 0, r: colsB.length - 1}
    }
  ]
  let colBMergeData = margeData.map(v => {
    let endIdx = colBStartAt + v - 1
    let res = {
      s: {c: 1, r: colBStartAt},
      e: {c: 1, r: endIdx}
    }
    colBStartAt = endIdx + 1
    return res
  })
  let colCMergeData = margeData.map(v => {
    let endIdx = colCStartAt + v - 1
    let res = {
      s: {c: 2, r: colCStartAt},
      e: {c: 2, r: endIdx}
    }
    colCStartAt = endIdx + 1
    return res
  })
  ws['!merges'] = [].concat(colAMergeData, colBMergeData, colCMergeData)
  // 构造workbook
  let name = `${weekStart}-${weekEnd}周${note}`
  let wb = {
    SheetNames: [name],
    Sheets: {
      [name]: ws
    }
  }
  // 导出
  XLSX.writeFile(wb, `./temp/${name}.xlsx`)
  console.log(`> 文件/temp/${name}.xlsx导出成功`)
}

;(() => {
  let targetPath = process.argv.slice(2)
  // 如果有参数说明命令行调用 node convert xxx.json
  if (targetPath.length) {
    convert(targetPath[0])
  }
})()

module.exports = convert