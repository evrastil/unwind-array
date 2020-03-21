const unwind = (dataObject, options) => {
  const unwindRecursive = (dataObject, path, currPath) => {
    const pathArr = path.split('.')
    if (!currPath) {
      currPath = pathArr[0]
    }
    const result = []
    let added = false
    const addObject = (objectTempUnwind, objectKey) => {
      Object.keys(objectTempUnwind).forEach(objectTempUnwindKey => {
        const newObjectCopy = {}
        Object.keys(dataObject).forEach(dataObjectKey => {
          newObjectCopy[dataObjectKey] = dataObject[dataObjectKey]
        })
        newObjectCopy[objectKey] = objectTempUnwind[objectTempUnwindKey]
        added = true
        result.push(newObjectCopy)
      })
    }
    Object.keys(dataObject).forEach(objectKey => {
      if (currPath === objectKey) {
        if (dataObject[objectKey] instanceof Array) {
          if (dataObject[objectKey].length === 0 && options.preserveEmptyArray !== true) {
            delete dataObject[objectKey]
          } else {
            Object.keys(dataObject[objectKey]).forEach(objectElementKey => {
              addObject(
                unwindRecursive(dataObject[objectKey][objectElementKey], path.replace(`${currPath}.`, '')),
                objectKey
              )
            })
          }
        } else {
          addObject(unwindRecursive(dataObject[objectKey], path.replace(`${currPath}.`, '')), objectKey)
        }
      }
    })
    if (!added) {
      result.push(dataObject)
    }
    return result
  }
  return unwindRecursive(dataObject, options.path)
}
module.exports = { unwind }
