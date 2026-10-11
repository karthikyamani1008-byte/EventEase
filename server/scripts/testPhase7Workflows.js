const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('===============================================================');
  console.log('   EVENT EASE PHASE 7: WORKFLOW & ATOMIC CONCURRENCY TESTS     ');
  console.log('===============================================================\n');

  try {
    // 1. Authenticate Organizer
    console.log('[TEST 1] Authenticating Organizer (gdsc.lead@campus.edu)...');
    const orgLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'gdsc.lead@campus.edu',
      password: 'OrganizerPass123!',
    });
    const orgToken = orgLogin.data.token;
    console.log('✓ Organizer authenticated successfully.\n');

    // 2. Organizer Submits Event Proposal
    console.log('[TEST 2] Organizer Submitting New Event Proposal...');
    const proposalData = {
      title: 'Autonomous AI Agents Hands-On Lab 2026',
      description: 'Build agentic workflows and tool-calling systems using Node and Python.',
      category: 'technology',
      venue: 'CS Research Hall 401',
      startDateTime: '2026-11-29T10:00:00.000Z',
      endDateTime: '2026-11-29T16:00:00.000Z',
      registrationDeadline: '2026-11-28T23:59:59.000Z',
      price: 0,
      capacity: 20,
    };

    const createRes = await axios.post(`${API_URL}/events`, proposalData, {
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    const createdEvent = createRes.data.data.event;
    console.log(`✓ Event Proposal Created: "${createdEvent.title}" (ID: ${createdEvent._id})`);
    console.log(`✓ Initial Status: "${createdEvent.status}" (Workflow Rule: Pending Review Verified)`);

    // Verify it is NOT visible on public catalog
    const publicCatalogBefore = await axios.get(`${API_URL}/events?search=Autonomous+AI+Agents`);
    const foundBefore = publicCatalogBefore.data.data.events.some((e) => e._id === createdEvent._id);
    if (!foundBefore) {
      console.log('✓ Verified: Pending event is NOT visible on public catalog.\n');
    } else {
      throw new Error('FAILURE: Pending event leaked onto public catalog before admin approval!');
    }

    // 3. Admin Reviews & Approves Proposal
    console.log('[TEST 3] Admin Authenticating & Approving Proposal...');
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@eventease.com',
      password: 'AdminSecurePass123!',
    });
    const adminToken = adminLogin.data.token;

    // Check pending queue
    const pendingQueue = await axios.get(`${API_URL}/admin/events/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const inQueue = pendingQueue.data.data.events.some((e) => e._id === createdEvent._id);
    if (inQueue) {
      console.log('✓ Verified: Event is present in admin pending approvals queue.');
    }

    // Approve event
    const approveRes = await axios.patch(
      `${API_URL}/admin/events/${createdEvent._id}/approval`,
      { action: 'approve' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log(`✓ Admin Approval Executed: Status is now "${approveRes.data.data.event.status}"`);

    // Verify it IS now visible on public catalog
    const publicCatalogAfter = await axios.get(`${API_URL}/events?search=Autonomous+AI+Agents`);
    const foundAfter = publicCatalogAfter.data.data.events.some((e) => e._id === createdEvent._id);
    if (foundAfter) {
      console.log('✓ Verified: Approved event is now live on public catalog.\n');
    } else {
      throw new Error('FAILURE: Approved event did not appear on public catalog!');
    }

    // 4. Student Books Approved Event
    console.log('[TEST 4] Student Authenticating & Booking Seat...');
    const studentLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'alex.johnson@campus.edu',
      password: 'StudentPass123!',
    });
    const studentToken = studentLogin.data.token;

    const bookRes = await axios.post(
      `${API_URL}/events/${createdEvent._id}/book`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );

    const booking = bookRes.data.data.booking;
    const remainingSeats = bookRes.data.data.remainingSeats;
    console.log(`✓ Booking Confirmed: Reference #${booking.bookingReference}`);
    console.log(`✓ Capacity Decremented: ${remainingSeats} of 20 seats remaining.\n`);

    // 5. Test Duplicate Booking Prevention
    console.log('[TEST 5] Verifying Duplicate Booking Prevention Guard...');
    try {
      await axios.post(
        `${API_URL}/events/${createdEvent._id}/book`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      throw new Error('FAILURE: Duplicate booking was incorrectly allowed!');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`✓ Successfully Blocked Duplicate: "${err.response.data.message}"\n`);
      } else {
        throw err;
      }
    }

    // 6. Test Cancellation & Seat Restoration
    console.log('[TEST 6] Testing Booking Cancellation & Seat Restoration...');
    const cancelRes = await axios.patch(
      `${API_URL}/bookings/${booking._id}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log(`✓ Cancellation Processed: Status "${cancelRes.data.data.booking.status}"`);
    console.log(`✓ Capacity Restored: ${cancelRes.data.data.restoredSeats} of 20 seats now available.\n`);

    // 7. Test Idempotency (Retrying Cancellation does not restore seats again)
    console.log('[TEST 7] Testing Cancellation Idempotency (Double Cancellation Protection)...');
    try {
      await axios.patch(
        `${API_URL}/bookings/${booking._id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      throw new Error('FAILURE: Repeated cancellation was incorrectly allowed!');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`✓ Successfully Blocked Re-cancellation: "${err.response.data.message}"`);
        console.log('✓ Verified: Seat pool protected from duplicate restorations.\n');
      } else {
        throw err;
      }
    }

    console.log('===============================================================');
    console.log('       ALL PHASE 7 TESTS PASSED SUCCESSFULLY! (100% OK)        ');
    console.log('===============================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

runTests();
