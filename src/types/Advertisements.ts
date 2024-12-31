export interface Shop {
    id: string
    name: string
    category: string
    description: string
    location: string
    city: string
    zip: string
    mobileNumber: string
    email?: string
    website?: string
    hours: string
    googleMapLink: string
    latitude: number
    longitude: number
    offers: Offer[]
  }
  
  export interface Offer {
    code: string
    description: string
  }
  
  export interface Category {
    id: string
    name: string
    icon: string
    color: string
  }
  
  export interface City {
    name: string
    zips: string[]
  }
  
  