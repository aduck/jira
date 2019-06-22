const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
/**
 * 分析工作量
 * @param target 可以是path或者Object
 */
const analysis = async target => {
  if (!target) throw new Error('缺少必要参数')
  let data = typeof target === 'string' ? JSON.parse(await readFile(target)): target
  console.log('> 开始分析工作量...')
  let result = []
  Object.keys(data).forEach(k => {
    let issues = data[k]
    let day = issues[0].day
    let total = issues.reduce((prev, {point}) => prev + point, 0)
    // 基准，每天6points
    let base = day * 6
    let status = total < base ? '不饱和' : (total > base ? '超负荷' : '饱和')
    result.push({user: k, day, total, status})
    console.log(`${k}-本周${day}天共${total}个points，状态：${status}`)
  })
  // 输出文件夹
  fs.writeFile('./temp/analysis.json', JSON.stringify(result), err => {
    if (err) throw err
    console.log(`> 分析完毕，结果已保存到/temp/analysis.json`)
  })
}

;(() => {
  let targetPath = process.argv.slice(2)
  // 如果有参数说明命令行调用 node analysis xxx.json
  if (targetPath.length) {
    analysis(targetPath[0])
  }
})()

module.exports = analysis