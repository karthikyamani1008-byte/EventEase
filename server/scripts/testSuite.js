const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedCount++;
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runComprehensiveTestSuite() {
  console.log('=====================================================================');
  console.log('       EVENT EASE: COMPREHENSIVE AUTOMATED TEST SUITE (PHASE 9)       ');
  console.log('=====================================================================\n');

  try {
    // -------------------------------------------------------------
    // GROUP 1: HEALTH & SYSTEM SANITY
    // -------------------------------------------------------------
    console.log('--- GROUP 1: Health Check & System Status ---');
    const healthRes = await axios.get(`${API_URL}/health`);
    assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
    assert(healthRes.data.status === 'healthy', 'System status is healthy');
    assert(healthRes.data.database === 'connected', 'Database is actively connected');
    console.log('');

    // -------------------------------------------------------------
    // GROUP 2: AUTHENTICATION & VALIDATION
    // -------------------------------------------------------------
    console.log('--- GROUP 2: Registration, Validation & Credentials ---');
    const testEmail = `test.student.${Date.now()}@campus.edu`;

    // 2.1 Valid Student Registration
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Student',
      email: testEmail,
      password: 'StrongPass123!',
      role: 'student',
      department: 'Computer Science',
      studentId: 'CS-TEST-99',
    });
    assert(regRes.status === 201, 'Student registration returns 201 Created');
    assert(Boolean(regRes.data.token), 'JWT token issued in registration response');
    assert(regRes.data.data.user.role === 'student', 'User assigned student role');
    const studentToken = regRes.data.token;

    // 2.2 Duplicate Email Rejection
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Duplicate Student',
        email: testEmail,
        password: 'StrongPass123!',
      });
      assert(false, 'Duplicate email should be rejected');
    } catch (err) {
      assert(err.response.status === 400, 'Duplicate registration correctly rejected with 400 Bad Request');
    }

    // 2.3 Weak Password Rejection
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Weak Pass',
        email: `weak.${Date.now()}@campus.edu`,
        password: '123',
      });
      assert(false, 'Weak password should be rejected');
    } catch (err) {
      assert(err.response.status === 400, 'Short password (< 6 chars) rejected with 400 Bad Request');
    }

    // 2.4 Self-Assigning Admin Role Blocked
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Hacker Admin',
        email: `hacker.${Date.now()}@campus.edu`,
        password: 'Password123!',
        role: 'admin',
      });
      assert(false, 'Self-assigning admin role should be blocked');
    } catch (err) {
      assert(err.response.status === 403, 'Admin role self-assignment blocked with 403 Forbidden');
    }

    // 2.5 Login with Valid Credentials
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'StrongPass123!',
    });
    assert(loginRes.status === 200, 'Login returns 200 OK');
    assert(Boolean(loginRes.data.token), 'Login returns valid session token');

    // 2.6 Login with Invalid Password
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: testEmail,
        password: 'WrongPassword!',
      });
      assert(false, 'Invalid password should be rejected');
    } catch (err) {
      assert(err.response.status === 401, 'Invalid password rejected with 401 Unauthorized');
    }
    console.log('');

    // -------------------------------------------------------------
    // GROUP 3: ROLE-BASED ACCESS CONTROL (RBAC) RESTRICTIONS
    // -------------------------------------------------------------
    console.log('--- GROUP 3: Role-Based Authorization Restrictions ---');

    // 3.1 Unauthenticated Request Blocked
    try {
      await axios.get(`${API_URL}/bookings/my`);
      assert(false, 'Unauthenticated request should be blocked');
    } catch (err) {
      assert(err.response.status === 401, 'Unauthenticated request to /bookings/my blocked with 401');
    }

    // 3.2 Student Attempting to Access Admin Endpoints
    try {
      await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      assert(false, 'Student should not access admin dashboard');
    } catch (err) {
      assert(err.response.status === 403, 'Student access to /admin/dashboard rejected with 403 Forbidden');
    }

    // 3.3 Student Attempting to Access Organizer Endpoints
    try {
      await axios.get(`${API_URL}/organizer/dashboard`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      assert(false, 'Student should not access organizer dashboard');
    } catch (err) {
      assert(err.response.status === 403, 'Student access to /organizer/dashboard rejected with 403 Forbidden');
    }

    // 3.4 Login as Admin and Verify Admin Access
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@eventease.com',
      password: 'AdminSecurePass123!',
    });
    const adminToken = adminLogin.data.token;
    const adminDash = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDash.status === 200, 'Admin successfully accesses /admin/dashboard');

    // 3.5 Login as Organizer
    const orgLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'gdsc.lead@campus.edu',
      password: 'OrganizerPass123!',
    });
    const orgToken = orgLogin.data.token;
    const orgDash = await axios.get(`${API_URL}/organizer/dashboard`, {
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    assert(orgDash.status === 200, 'Organizer successfully accesses /organizer/dashboard');
    console.log('');

    // -------------------------------------------------------------
    // GROUP 4: SEARCH, FILTERS & PUBLIC CATALOG
    // -------------------------------------------------------------
    console.log('--- GROUP 4: Public Catalog Search & Filtering ---');
    const allEvents = await axios.get(`${API_URL}/events`);
    assert(allEvents.status === 200, 'Public events catalog fetched with 200 OK');
    assert(Array.isArray(allEvents.data.data.events), 'Events returned as array');

    // Keyword Search
    const searchRes = await axios.get(`${API_URL}/events?search=Summit`);
    assert(searchRes.data.data.events.length > 0, 'Keyword search "?search=Summit" returns matches');

    // Category Filter
    const catRes = await axios.get(`${API_URL}/events?category=technology`);
    const allTech = catRes.data.data.events.every((e) => e.category === 'technology');
    assert(allTech, 'Category filter "?category=technology" returns only technology events');

    // Price Filter (Free)
    const freeRes = await axios.get(`${API_URL}/events?price=free`);
    const allFree = freeRes.data.data.events.every((e) => e.price === 0);
    assert(allFree, 'Price filter "?price=free" returns only free events');
    console.log('');

    // -------------------------------------------------------------
    // GROUP 5: EVENT WORKFLOW & REJECTION REASON ENFORCEMENT
    // -------------------------------------------------------------
    console.log('--- GROUP 5: Event Workflow & Rejection Reasons ---');
    // Organizer submits proposal
    const testProposal = await axios.post(
      `${API_URL}/events`,
      {
        title: 'Quantum Algorithms Seminar',
        description: 'Exploring quantum entanglement and superposition circuits.',
        category: 'technology',
        venue: 'Quantum Bay 1',
        startDateTime: '2026-12-15T10:00:00.000Z',
        endDateTime: '2026-12-15T14:00:00.000Z',
        registrationDeadline: '2026-12-14T18:00:00.000Z',
        capacity: 15,
        price: 0,
      },
      { headers: { Authorization: `Bearer ${orgToken}` } }
    );
    const proposalId = testProposal.data.data.event._id;
    assert(testProposal.data.data.event.status === 'pending', 'Submitted event starts with status "pending"');

    // Admin rejects WITHOUT reason -> MUST fail
    try {
      await axios.patch(
        `${API_URL}/admin/events/${proposalId}/approval`,
        { action: 'reject' },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      assert(false, 'Rejection without reason should be blocked');
    } catch (err) {
      assert(err.response.status === 400, 'Rejection without reason correctly blocked with 400 Bad Request');
    }

    // Admin rejects WITH reason -> MUST succeed
    const rejectRes = await axios.patch(
      `${API_URL}/admin/events/${proposalId}/approval`,
      {
        action: 'reject',
        rejectionReason: 'Conflict with physics department lab maintenance schedule.',
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(rejectRes.data.data.event.status === 'rejected', 'Event status transitioned to "rejected"');
    assert(
      rejectRes.data.data.event.rejectionReason.includes('maintenance'),
      'Rejection reason recorded on event document'
    );

    // Admin approves another proposal -> MUST transition to approved
    const approvedEvtRes = await axios.patch(
      `${API_URL}/admin/events/${proposalId}/approval`,
      { action: 'approve' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(approvedEvtRes.data.data.event.status === 'approved', 'Event status transitioned to "approved"');
    console.log('');

    // -------------------------------------------------------------
    // GROUP 6: ATOMIC BOOKINGS, CONCURRENCY & CANCELLATION
    // -------------------------------------------------------------
    console.log('--- GROUP 6: Atomic Bookings & Seat Safeguards ---');
    // Booking
    const bookRes = await axios.post(
      `${API_URL}/events/${proposalId}/book`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    assert(bookRes.status === 201, 'Seat reservation returns 201 Created');
    assert(bookRes.data.data.remainingSeats === 14, 'Seat capacity atomically decremented from 15 to 14');
    const bookingId = bookRes.data.data.booking._id;

    // Duplicate booking block
    try {
      await axios.post(
        `${API_URL}/events/${proposalId}/book`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      assert(false, 'Duplicate booking should be rejected');
    } catch (err) {
      assert(err.response.status === 400, 'Duplicate booking correctly rejected with 400 Bad Request');
    }

    // Cancellation & Seat Restoration
    const cancelRes = await axios.patch(
      `${API_URL}/bookings/${bookingId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    assert(cancelRes.status === 200, 'Cancellation processed with 200 OK');
    assert(cancelRes.data.data.restoredSeats === 15, 'Seat capacity restored back to 15');

    // Repeated Cancellation Block (Idempotency)
    try {
      await axios.patch(
        `${API_URL}/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      assert(false, 'Double cancellation should be rejected');
    } catch (err) {
      assert(err.response.status === 400, 'Duplicate cancellation correctly blocked (zero extra seat restoration)');
    }
    console.log('');

    // -------------------------------------------------------------
    // GROUP 7: ERROR HANDLING & EDGE CASES
    // -------------------------------------------------------------
    console.log('--- GROUP 7: Error Handling & Invalid IDs ---');
    // Malformed ObjectId
    try {
      await axios.get(`${API_URL}/events/invalid-mongo-id-12345`);
      assert(false, 'Malformed ID should return error');
    } catch (err) {
      assert(err.response.status === 400, 'Malformed ObjectId handled cleanly with 400 (CastError), no crash');
    }

    // Non-existent valid ObjectId
    try {
      await axios.get(`${API_URL}/events/60b8d29f8f1b2c0015c8e4a9`);
      assert(false, 'Non-existent ID should return 404');
    } catch (err) {
      assert(err.response.status === 404, 'Non-existent valid ObjectId returns 404 Not Found');
    }

    // Undefined route
    try {
      await axios.get(`${API_URL}/undefined-route-endpoint`);
      assert(false, 'Undefined route should return 404');
    } catch (err) {
      assert(err.response.status === 404, 'Undefined route returns 404 Not Found');
    }
    console.log('');

    console.log('=====================================================================');
    console.log(`  ALL ${passedCount} INTEGRATION TESTS PASSED! (${failedCount} failures)`);
    console.log('=====================================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test Suite Aborted with Error:', error.message);
    process.exit(1);
  }
}

runComprehensiveTestSuite();
