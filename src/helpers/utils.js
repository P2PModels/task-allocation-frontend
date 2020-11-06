export function capitalizeFirstLetter(word) {
  if (typeof word === 'string')
    return word.charAt(0).toUpperCase() + word.slice(1)
  else return ''
}

export function getRandomElement(elements) {
  return elements[Math.floor(Math.random() * elements.length)]
}
