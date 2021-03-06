const positionToResource = {
  user: 1,
}

export function getResourceFromPathname(pathname, resourceName) {
  const resources = pathname.split('/').filter(p => p.length)

  const pos = positionToResource[resourceName]
  if (pos > -1 && resources && resources.length) {
    return resources[pos]
  }

  return null
}
