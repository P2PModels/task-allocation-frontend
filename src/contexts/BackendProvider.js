import React, { useEffect, useState } from 'react'
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloProvider,
} from '@apollo/client'
import { useAppState } from './AppState'

export function BackendProvider(props) {
    const { children } = props
    const { endpoint } = useAppState()

    const createClient = endpoint => {
        const httpLink = createHttpLink({
            uri: endpoint,
        })

        const client = new ApolloClient({
            link: httpLink,
            cache: new InMemoryCache(),
        })

        return client
    }

    return (
        <ApolloProvider client={createClient(endpoint)}>
            {children}
        </ApolloProvider>
    )
}
