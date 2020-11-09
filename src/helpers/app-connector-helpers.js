export function getFieldFromEntityId(entityId, fieldName, separator = '-') {
  const fields = entityId.split(separator)
  const selectedField = fields.filter(f => f.search(fieldName) > -1)
  if (selectedField && selectedField.length) {
    const fieldValue = selectedField[0].split(':')[1]

    return fieldValue
  }
  return null
}
