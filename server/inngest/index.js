import { Inngest } from 'inngest';
import User from '../models/User.js';

export const inngest = new Inngest({
  id: 'movie-ticket-booking',
});

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

export const functions = [syncUserCreation];