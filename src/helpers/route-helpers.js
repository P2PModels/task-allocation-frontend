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

export function generateUrl(url, params) {
    // If the url doesn't finish with / add it
    let generatedUrl = url[url.length - 1] === '/' ? url : url + '/'
    // Find each parameter and add if it doesn't exist or update it
    params.forEach(p => {
        if (p.key && p.value)
            if (generatedUrl[generatedUrl.length - 1] === '/')
                generatedUrl += p.key + '=' + p.value
            else generatedUrl += '&' + p.key + '=' + p.value
    })
    return generatedUrl
}
