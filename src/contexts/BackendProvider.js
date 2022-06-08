import React from 'react'
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloProvider,
} from '@apollo/client'

export function BackendProvider(props) {
    const { children } = props

    const httpLink = createHttpLink({
        uri: process.env.REACT_APP_SUBGRAPH_ENDPOINT,
    })

    const client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    })

    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
