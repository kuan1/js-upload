import SparkMD5 from 'spark-md5'

interface FP {
  mozSlice?: (
    start?: number | undefined,
    end?: number | undefined,
    contentType?: string | undefined
  ) => Blob
  webkitSlice?: (
    start?: number | undefined,
    end?: number | undefined,
    contentType?: string | undefined
  ) => Blob
  [x: string]: any
}

export default function getFileMD5(file: File, processFn: (percent: string) => void | undefined) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader() //分块读取文件对象
    // file的slice方法，注意它的兼容性，在不同浏览器的写法不同
    const p: FP = File.prototype
    const blobSlice = p.slice || p.mozSlice || p.webkitSlice

    const chunkSize = 10 * 1024 * 1024 // 分块大小，10M
    const chunks = Math.ceil(file.size / chunkSize) //总块数
    let currentChunk = 0 //当前块数
    const spark = new SparkMD5() //获取MD5对象

    fileReader.onload = (e) => {
      const result = e.target?.result
      if (!result) return reject('浏览器不支持FileReader')
      //数据加载完毕事件
      let binaryStr = ''
      const bytes = result instanceof ArrayBuffer ? new Uint8Array(result) : ''
      const length = bytes ? bytes.byteLength : 0
      for (let i = 0; i < length; i++) {
        binaryStr += String.fromCharCode(Number(bytes[i])) //二进制转换字符串
      }
      spark.appendBinary(binaryStr)
      currentChunk++
      if (processFn) {
        processFn(`${Math.ceil((currentChunk / chunks) * 100)}%`)
      } else {
        console.log('读取文件', `${Math.ceil((currentChunk / chunks) * 100)}%`)
      }
      if (currentChunk < chunks) {
        loadNext() //读取下一块数据
      } else {
        const fileMd5 = spark.end() //得到文件MD5值
        resolve(fileMd5)
      }
    }
    fileReader.onerror = (e) => {
      reject(e)
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      //根据开始和结束位置，切割文件
      const b = blobSlice.call(file, start, end)
      //readAsBinaryString ie浏览器不兼容此方法
      //fileReader.readAsBinaryString(blobSlice.call(file, start, end));
      fileReader.readAsArrayBuffer(b) //ie，chrome，firefox等主流浏览器兼容此方法
    }
    loadNext()
  })
}
