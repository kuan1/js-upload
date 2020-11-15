interface GetFileOptions {
  multiple?: boolean // 文件类型
  accept?: string // 是否多选
}

/**
 * 获取多个文件
 * @param option {GetFileOptions}
 */
export function getFiles(option: GetFileOptions = {}): Promise<FileList> {
  const { accept = 'image/*', multiple = true } = option
  const id = 'kuan-upload-input'
  let _input = document.getElementById(id) as HTMLInputElement
  if (!_input) {
    _input = document.createElement('input')
    _input.id = id
    _input.type = 'file'
    _input.style.display = 'none'
    document.body.appendChild(_input)
  }
  _input.value = ''
  _input.accept = accept
  _input.multiple = multiple

  _input.click()

  return new Promise((resolve, reject) => {
    _input.onchange = () => {
      const files = (_input as HTMLInputElement).files
      if (files && files.length) {
        resolve(files)
      } else {
        reject('选择文件失败')
      }
    }
  })
}

/**
 * 获取单个文件
 * @param o {GetFileOptions}
 */
export async function getFile(o: GetFileOptions): Promise<File> {
  const options: GetFileOptions = o || {}
  options.multiple = false
  const fileList = await getFiles(options)
  return fileList[0]
}

/**
 * 获取拖拽的文件
 */
export function getDropFile(e: DragEvent) {
  e.preventDefault()
  return e.dataTransfer?.files
}
