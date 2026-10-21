import { Inngest } from 'inngest';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import sendEmail from '../configs/nodeMailer.js';
// Initialize Inngest
export const inngest = new Inngest({
  id: 'movie-ticket-booking',
});

// Create User when a new user signs up through Clerk
const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk',
    triggers: { event: 'clerk/user.created' },
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ''} ${last_name || ''}`.trim(),
      image: image_url,
    };

    await User.create(userData);
  }
);

// Delete User when the user is deleted from Clerk
const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-with-clerk',
    triggers: { event: 'clerk/user.deleted' },
  },
  async ({ event }) => {
    const { id } = event.data;

    if (id) {
      await User.findByIdAndDelete(id);
    }
  }
);

// Update User when the user's information changes in Clerk
const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-with-clerk',
    triggers: { event: 'clerk/user.updated' },
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


const releaseSeatsAndDeleteBookings = inngest.createFunction(
  {
    id: 'release-seats-delete-booking',
    triggers: { event: 'app/checkpayment' },
  },
  async ({ event, step }) => {
    await step.sleep('wait-for-10-minutes', '10m');

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      // Booking may already have been deleted.
      if (!booking) {
        console.log('Booking not found:', bookingId);
        return;
      }

      // Keep seats reserved if payment has been completed.
      if (booking.isPaid) {
        console.log('Booking is paid. Keeping seats reserved.');
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(booking.show)) {
        console.log('Invalid ObjectId for show:', booking.show);
        return;
      }

      const show = await Show.findById(booking.show);

      if (!show) {
        console.log('Show not found:', booking.show);
        await Booking.findByIdAndDelete(booking._id);
        return;
      }

      // Release only seats belonging to this booking's user.
      booking.bookedSeats.forEach((seat) => {
        if (show.occupiedSeats?.[seat] === booking.user) {
          delete show.occupiedSeats[seat];
        }
      });

      show.markModified('occupiedSeats');
      await show.save();

      await Booking.findByIdAndDelete(booking._id);

      console.log('Unpaid booking deleted and seats released:', bookingId);
    });
  }
);


const sendEmailBook = inngest.createFunction(
  {
    id: 'send-booking-email',
    triggers: { event: 'app/show.booked' },
  },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    await step.run('send-booking-confirmation-email', async () => {
      const booking = await Booking.findById(bookingId)
        .populate({
          path: 'show',
          populate: {
            path: 'movie',
            model: 'Movie',
          },
        })
        .populate('user');

      if (!booking) {
        console.log('Booking not found:', bookingId);
        return;
      }

      if (!booking.show || !booking.show.movie || !booking.user) {
        console.log('Booking details are incomplete:', bookingId);
        return;
      }

      await sendEmail({
        to: booking.user.email,
        subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hi ${booking.user.name},</h2>

            <p>
              Your booking for
              <strong style="color: #F84565;">
                ${booking.show.movie.title}
              </strong>
              is confirmed.
            </p>

            <p>
              <strong>Date:</strong>
              ${new Date(booking.show.showDateTime).toLocaleDateString(
                'en-US',
                { timeZone: 'Asia/Karachi' }
              )}
              <br />

              <strong>Time:</strong>
              ${new Date(booking.show.showDateTime).toLocaleTimeString(
                'en-US',
                {
                  timeZone: 'Asia/Karachi',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
            </p>

            <p>Enjoy the show! 🍿</p>

            <p>
              Thanks for booking with us!<br />
              - QuickShow Team
            </p>
          </div>
        `,
      });
    });
  }
);
// Export all functions for Inngest registration
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBookings,
  sendEmailBook
];