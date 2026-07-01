import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      category: a.enum(['TAPE_BALL', 'HARD_BALL', 'ACCESSORIES']),
      subcategory: a.string(),
      images: a.string().array(),
      stock: a.integer().default(0),
      sku: a.string(),
      featured: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
    ]),

  UserProfile: a
    .model({
      owner: a.string(),
      fullName: a.string(),
      phone: a.string(),
      address: a.string(),
      city: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Order: a
    .model({
      owner: a.string(),
      items: a.string().required(), // JSON string: [{productId, name, price, qty, image}]
      subtotal: a.float().required(),
      shippingFee: a.float().default(0),
      total: a.float().required(),
      paymentMethod: a.enum(['COD', 'JAZZCASH', 'EASYPAISA']),
      paymentStatus: a.enum(['PENDING', 'PAID', 'FAILED']),
      orderStatus: a.enum(['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
      shippingName: a.string().required(),
      shippingPhone: a.string().required(),
      shippingAddress: a.string().required(),
      shippingCity: a.string().required(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
