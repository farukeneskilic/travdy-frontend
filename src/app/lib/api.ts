// lib/api.ts
import {Attraction} from './types'

// For now we use mock data. Swap these with your backend calls.
export async function getTopAttractions(): Promise<Attraction[]> {
    return [
        {
            id: 'paris',
            city: 'Paris',
            title: 'Louvre Museum',
            image: '/placeholder.jpg',
            priceFrom: '$25/ticket',
            rating: 9.1
        },
        {
            id: 'nyc',
            city: 'New York',
            title: 'Statue of Liberty',
            image: '/placeholder.jpg',
            priceFrom: '$18/ticket',
            rating: 9.4
        },
        {
            id: 'tokyo',
            city: 'Tokyo',
            title: 'Shinjuku Gyoen',
            image: '/placeholder.jpg',
            priceFrom: '$5/ticket',
            rating: 9.4
        },
        {
            id: 'istanbul',
            city: 'Istanbul',
            title: 'Cat City',
            image: '/placeholder.jpg',
            priceFrom: '$10/ticket',
            rating: 10.0
        },
        {id: 'rome', city: 'Rome', title: 'Colosseum', image: '/placeholder.jpg', priceFrom: '$20/ticket', rating: 9.5},
    ]
}

export async function getFeaturedCities(): Promise<Attraction[]> {
    return [
        {id: 'paris-city', city: 'Paris', title: 'Paris', image: '/placeholder.jpg'},
        {id: 'nyc-city', city: 'New York', title: 'New York', image: '/placeholder.jpg'},
        {id: 'barcelona-city', city: 'Barcelona', title: 'Barcelona', image: '/placeholder.jpg'},
        {id: 'tokyo-city', city: 'Tokyo', title: 'Tokyo', image: '/placeholder.jpg'},
        {id: 'rome-city', city: 'Rome', title: 'Rome', image: '/placeholder.jpg'},
        {id: 'berlin-city', city: 'Berlin', title: 'Berlin', image: '/placeholder.jpg'},
    ]
}
