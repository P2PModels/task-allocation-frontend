export function capitalizeFirstLetter(word) {
  if (typeof word === 'string')
    return word.charAt(0).toUpperCase() + word.slice(1)
  else return ''
}

export function getRandomElement(elements) {
  return elements[Math.floor(Math.random() * elements.length)]
}

export function buildMapById(elements, idField = 'id') {
  return elements.reduce((map, currElement) => {
    const id = currElement[idField]
    map.set(id, currElement)
    return map
  }, new Map())
}
