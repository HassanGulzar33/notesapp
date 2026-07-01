import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    phoneNumber: { required: false, mutable: true },
    address: { required: false, mutable: true },
  },
});
