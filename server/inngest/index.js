import { Inngest } from 'inngest';
import User from '../models/User.js';

export const inngest = new Inngest({
  id: 'movie-ticket-booking',
});

// Create User
const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk',
    triggers: [{ event: 'clerk/user.created' }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ''} ${last_name || ''}`.trim(),
      image: image_url,
    };

    await User.create(userData);
  }
);

// Delete User
const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
    triggers: [{ event: 'clerk/user.deleted' }],
  },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);

// Update User
const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-with-clerk',
    triggers: [{ event: 'clerk/user.updated' }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ''} ${last_name || ''}`.trim(),
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData, { new: true });
  }
);

// Export all functions for Inngest registration.
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];