import SparkMD5 from 'spark-md5'

interface FP {
  mozSlice?: (start?: number | undefined, end?: number | undefined, contentType?: string | undefined) => Blob
  webkitSlice?: (start?: number | undefined, end?: number | undefined, contentType?: string | undefined) => Blob
  [x: string]: any
}

export default function getFileMD5(file: File, processFn: (percent: string) => void | undefined) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader() //分块读取文件对象
    // file的slice方法，注意它的兼容性，在不同浏览器的写法不同
    const p: FP = File.prototype
    const blobSlice = p.slice || p.mozSlice || p.webkitSlice

    const spark = new SparkMD5.ArrayBuffer() //获取MD5对象
    const chunkSize = 2097152 // 分块大小，2M
    const chunks = Math.ceil(file.size / chunkSize) //总块数
    let currentChunk = 0 //当前块数

    fileReader.onload = (e) => {
      const result = e.target?.result
      if (!result) return reject(new Error('浏览器不支持FileReader'))
      //数据加载完毕事件
      spark.append(result as ArrayBuffer)
      currentChunk++
      if (processFn) {
        processFn(`${Math.ceil((currentChunk / chunks) * 100)}%`)
      } else {
        console.log('读取文件', `${Math.ceil((currentChunk / chunks) * 100)}%`)
      }
      if (currentChunk < chunks) {
        loadNext() //读取下一块数据
      } else {
        resolve(spark.end()) // 得到文件MD5值
        spark.destroy()
      }
    }
    fileReader.onerror = (e) => {
      reject(e)
      spark.destroy()
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      //根据开始和结束位置，切割文件
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end)) //ie，chrome，firefox等主流浏览器兼容此方法
    }
    loadNext()
  })
}
