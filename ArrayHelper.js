module.exports = {
  findIndexInArrayObj,
  findInArrayObj,
  sortArrayNumber,
  sortArrayObject
}


function findInArrayObj (_array, finding_value, field='id') {
  if (!field) throw new Error('findIndexInArrayObj: field for find not defined')
  return _array.find(function(item){
    return item[field] === finding_value
  })
}

function findIndexInArrayObj (_array, finding_value, field='id') {
  if (!field) throw new Error('findIndexInArrayObj: field for find not defined')
  return _array.findIndex(function(item){
    return item[field] === finding_value
  })
}

function sortArrayNumber(arr) {
  return arr.sort((a, b) => a - b)
}

function sortArrayObject(arr, key) {
  arr.sort(function (a, b) {
    let keyA = a[key].toLowerCase()
    let keyB = b[key].toLowerCase()
    if (keyA < keyB) //сортируем строки по возрастанию
      return -1
    if (keyA > keyB)
      return 1
    return 0
  })
}