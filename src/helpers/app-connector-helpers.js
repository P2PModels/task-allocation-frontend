export function getFieldFromEntityId(entityId, fieldName, separator = '-') {
  const fields = entityId.split(separator)
  const selectedField = fields.filter(f => f.search(fieldName) > -1)
  if (selectedField && selectedField.length) {
    const fieldValue = selectedField[0].split(':')[1]

    return fieldValue
  }
  return null
}

export function getAppByName(apps, appName) {
  if (apps) return apps.find(app => app.name === appName)
}
