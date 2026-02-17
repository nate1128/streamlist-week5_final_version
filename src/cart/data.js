
// src/cart/data.js
// Source data for subscriptions and accessories (now with `icon` for Material Icons)
export const subscriptions = [
  {
    id: 'sub-basic',
    name: 'EZTech Basic',
    price: 9.99,
    type: 'subscription',
    description: 'Email support, 5GB cloud',
    icon: 'handyman' // wrench + screwdriver
  },
  {
    id: 'sub-pro',
    name: 'EZTech Pro',
    price: 19.99,
    type: 'subscription',
    description: 'Priority support, 50GB cloud',
    icon: 'handyman'
  },
  {
    id: 'sub-enterprise',
    name: 'EZTech Enterprise',
    price: 49.99,
    type: 'subscription',
    description: 'SLA, 1TB cloud, SSO',
    icon: 'handyman'
  },
   {
  id: 'sub-movie-plus',
  name: 'Movie Plus Add‑On',
  price: 4.99,
  type: 'subscription',
  description: 'Unlock bonus watchlists, curated genres, and early releases.',
  icon: 'theaters'
},
{
  id: 'sub-family-pack',
  name: 'Family Sharing Pack',
  price: 3.99,
  type: 'subscription',
  description: 'Add up to 4 family profiles with parental controls.',
  icon: 'family_restroom'
}
];

export const accessories = [
  {
    id: 'acc-shirt',
    name: 'EZTech Shirt',
    price: 14.0,
    type: 'accessory',
    description: '100% cotton',
    icon: 'checkroom' // clothing hanger
  },
  {
    id: 'acc-case',
    name: 'Phone Case',
    price: 12.5,
    type: 'accessory',
    description: 'Fits most phones',
    icon: 'phone_iphone' // phone
  },
  {
    id: 'acc-sticker',
    name: 'Sticker Pack',
    price: 4.0,
    type: 'accessory',
    description: 'Waterproof stickers',
    icon: 'sticky_note_2' // sticky note / stickers
  },
  {
    id: 'acc-hoodie',
    name: 'EZTech Hoodie',
    price: 28.0,
    type: 'accessory',
    description: 'Cozy fleece-lined hoodie with cinematic logo',
    icon: 'checkroom'
  },
  {
    id: 'acc-remote',
    name: 'Universal Streaming Remote',
    price: 18.0,
    type: 'accessory',
    description: 'Bluetooth remote compatible with all streaming apps',
    icon: 'settings_remote'
  },
  {
    id: 'acc-led',
    name: 'LED Backlight Strip',
    price: 12.0,
    type: 'accessory',
    description: 'Ambient LED strip for immersive movie nights',
    icon: 'light_mode'
  },
  {
  id: 'acc-poster',
  name: 'Film Reel Poster',
  price: 8.0,
  type: 'accessory',
  description: 'Vintage-style film reel wall art',
  icon: 'theaters'
},
];

// At bottom or top of src/cart/data.js
console.table(
  accessories.map(a => ({ id: a.id, icon: a.icon }))
);