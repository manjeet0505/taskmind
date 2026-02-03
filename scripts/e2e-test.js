(async () => {
  const base = 'http://localhost:3001';
  const email = `e2e+${Date.now()}@example.com`;
  const password = 'Testpass123!';

  const fetchJson = async (res) => {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  }

  console.log('Signing up', email);
  let res = await fetch(`${base}/api/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'E2E User', email, password }) });
  console.log('Signup status', res.status);
  console.log(await fetchJson(res));

  console.log('Logging in');
  res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), redirect: 'manual' });
  console.log('Login status', res.status);
  const setCookie = res.headers.get('set-cookie') || '';
  console.log('Set-Cookie header:', setCookie);
  const match = setCookie.match(/token=([^;]+)/);
  if (!match) {
    console.error('Login did not return token cookie. Aborting.');
    process.exit(1);
  }
  const token = match[1];
  const cookieHeader = `token=${token}`;

  // Create two tasks
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];

  console.log('Creating Task A (high priority, due today)');
  res = await fetch(`${base}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, body: JSON.stringify({ title: 'Pay invoices', description: 'Pay vendor invoices', priority: 'high', status: 'pending', category: 'Finance', dueDate: today, tags: ['finance','urgent'] }) });
  console.log('Create A status', res.status);
  console.log(await fetchJson(res));

  console.log('Creating Task B (low priority, due tomorrow)');
  res = await fetch(`${base}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, body: JSON.stringify({ title: 'Plan team lunch', description: 'Pick date and menu', priority: 'low', status: 'pending', category: 'HR', dueDate: tomorrow, tags: ['social'] }) });
  console.log('Create B status', res.status);
  console.log(await fetchJson(res));

  // Fetch tasks
  console.log('Fetching tasks');
  res = await fetch(`${base}/api/tasks`, { method: 'GET', headers: { 'Cookie': cookieHeader } });
  console.log('Fetch tasks status', res.status);
  const tasks = await res.json();
  console.log('Tasks:', tasks);

  // Get Insights
  console.log('Requesting AI Insights');
  res = await fetch(`${base}/api/ai/insights`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, body: JSON.stringify({ today }) });
  console.log('Insights status', res.status);
  const insights = await res.json();
  console.log('Insights response:', insights);

  // Chat
  console.log('Sending chat message');
  res = await fetch(`${base}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader }, body: JSON.stringify({ message: "What should I focus on today?" }) });
  console.log('Chat status', res.status);
  const chatText = await res.text();
  console.log('Chat reply:', chatText);

  console.log('E2E script completed');
})();