const unwindArrays = (dataObject, path) => {
  return unwindArraysRecursive(dataObject, path)
}
const unwindArraysRecursive = (dataObject, path, currPath) => {
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
        if (dataObject[dataObjectKey] instanceof Array && dataObject[dataObjectKey].length === 0) {
          // newObjectCopy[dataObjectKey] = null;
        } else {
          newObjectCopy[dataObjectKey] = dataObject[dataObjectKey]
        }
      })
      newObjectCopy[objectKey] = objectTempUnwind[objectTempUnwindKey]
      added = true
      result.push(newObjectCopy)
    })
  }
  Object.keys(dataObject).forEach(objectKey => {
    if (currPath === objectKey) {
      if (dataObject[objectKey] instanceof Array) {
        Object.keys(dataObject[objectKey]).forEach(objectElementKey => {
          addObject(
            unwindArraysRecursive(dataObject[objectKey][objectElementKey], path.replace(`${currPath}.`, '')),
            objectKey
          )
        })
      } else {
        addObject(unwindArraysRecursive(dataObject[objectKey], path.replace(`${currPath}.`, '')), objectKey)
      }
    }
  })
  if (!added) {
    result.push(dataObject)
  }
  return result
}

module.exports = { unwindArrays }
