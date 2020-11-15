interface ProgressOptions {
  loaded: number
  total: number
}

interface UploadOptions {
  url: string
  data: FormData
  onProgress: (o: ProgressOptions) => void | undefined
  toast: (text: string) => void | undefined
  withCredentials: boolean
}

interface ResponseError extends Error {
  response: object
}

/**
 * @description: 上传文件
 * @param url {String} 上传地址
 * @param data {FormData} 上传对象
 * @param withCredentials {Boolean} 是否携带cookie
 * @param onProgress {Function} 进度
 * @return Promise
 */
export default function upload(options: UploadOptions): Promise<any> {
  const { url, data, onProgress, toast = alert, withCredentials = false } = options
  return new Promise((resolve, reject) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest()
    if (!xhr.upload) return reject(new Error('xhr no upload methods'))
    xhr.upload.addEventListener(
      'progress',
      (e) => {
        if (onProgress) {
          onProgress({ loaded: e.loaded, total: e.total })
        }
      },
      false
    )
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const res = JSON.parse(xhr.responseText)
            resolve(res)
          } catch (e) {
            resolve(xhr.responseText)
          }
        } else {
          const msg = `发生错误 ${xhr.status}`
          const err = new Error(msg) as ResponseError
          err.response = xhr
          toast && toast(msg)
          reject(err)
        }
      }
    }
    xhr.withCredentials = withCredentials
    xhr.open('POST', url, true)
    xhr.send(data)
  })
}
