export function getResourceFromPathname(pathname, resourceName) {
    const resources = pathname.split('/').filter(p => p.length)
    const params = resources[resources.length-1].split('&').filter(p => p.length)

    let value
    params.forEach(p => {
        if(p.includes(resourceName))
            value = p.split('=')[1]
    })

    return value
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
