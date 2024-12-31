import { Category, City, Shop } from "@/types/Advertisements";

export const categories: Category[] = [
  { id: '1', name: 'Restaurant', icon: 'Utensils', color: 'from-orange-600 to-red-600' },
  { id: '2', name: 'Retail', icon: 'ShoppingBag', color: 'from-blue-600 to-indigo-600' },
  { id: '3', name: 'Services', icon: 'Briefcase', color: 'from-green-600 to-emerald-600' },
  { id: '4', name: 'Entertainment', icon: 'Music', color: 'from-purple-600 to-pink-600' },
  { id: '5', name: 'Health & Wellness', icon: 'Heart', color: 'from-red-600 to-pink-600' },
  { id: '6', name: 'Education', icon: 'GraduationCap', color: 'from-yellow-600 to-orange-600' },
  { id: '7', name: 'Technology', icon: 'Cpu', color: 'from-cyan-600 to-blue-600' },
  { id: '8', name: 'Automotive', icon: 'Car', color: 'from-gray-600 to-slate-600' },
  { id: '9', name: 'Home & Garden', icon: 'Home', color: 'from-lime-600 to-green-600' },
  { id: '10', name: 'Sports & Fitness', icon: 'Dumbbell', color: 'from-sky-600 to-blue-600' },
  { id: '11', name: 'Travel', icon: 'Plane', color: 'from-teal-600 to-cyan-600' },
  { id: '12', name: 'Pet Services', icon: 'Paw', color: 'from-amber-600 to-yellow-600' },
];

export const cities: City[] = [
  { name: 'Anytown', zips: ['12345', '12346', '12347'] },
  { name: 'Somewhere', zips: ['67890', '67891', '67892'] },
  { name: 'Newville', zips: ['54321', '54322', '54323'] },
];

export const shops: Shop[] = [
  {
    id: '1',
    name: "Joe's Diner",
    category: 'Restaurant',
    description: 'Classic American diner serving breakfast all day.',
    location: '123 Main St',
    city: 'Anytown',
    zip: '12345',
    mobileNumber: '(555) 123-4567',
    email: 'info@joesdiner.com',
    website: 'https://www.joesdiner.com',
    hours: 'Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-11PM',
    googleMapLink: 'https://goo.gl/maps/exampleJoesDiner',
    latitude: 40.7128,
    longitude: -74.0060,
    offers: [
      { code: 'MEAL4TWO', description: 'Buy 1 meal, get 1 free' },
      { code: 'HAPPYHOUR', description: '30% off appetizers from 4-6 PM' }
    ]
  },
  {
    id: '2',
    name: "Tech Haven",
    category: 'Technology',
    description: 'Your one-stop shop for all things tech.',
    location: '456 Gadget Ave',
    city: 'Somewhere',
    zip: '67890',
    mobileNumber: '(555) 987-6543',
    email: 'support@techhaven.com',
    website: 'https://www.techhaven.com',
    hours: 'Mon-Sat: 10AM-9PM, Sun: 11AM-6PM',
    googleMapLink: 'https://goo.gl/maps/exampleTechHaven',
    latitude: 37.7749,
    longitude: -122.4194,
    offers: [
      { code: 'NEWCUSTOMER', description: '10% off your first purchase' },
      { code: 'UPGRADE2023', description: 'Free setup with any computer purchase' }
    ]
  },
  {
    id: '3',
    name: "Paws & Claws Pet Store",
    category: 'Pet Services',
    description: 'Everything your furry friends need and more.',
    location: '789 Bark Street',
    city: 'Newville',
    zip: '54321',
    mobileNumber: '(555) 246-8135',
    email: 'woof@pawsandclaws.com',
    website: 'https://www.pawsandclaws.com',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    googleMapLink: 'https://goo.gl/maps/examplePawsAndClaws',
    latitude: 34.0522,
    longitude: -118.2437,
    offers: [
      { code: 'GOODBOY', description: '20% off all dog toys' },
      { code: 'PURRFECT', description: 'Buy one, get one 50% off cat food' }
    ]
  },
];

