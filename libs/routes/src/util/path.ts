export const joinPath = (...paths: string[]) => {
  let result = ""
  paths.forEach((x) => {
    x = x.replace('/', '')
    result += `/${x}`

  })
  return result
}
