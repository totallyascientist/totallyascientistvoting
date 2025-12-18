const DRIVERS = [
  'rose','tzuyu','jay','bang chan','winter','chaewon','sullyoon','lisa',
  'sana','mingyu','mina','nayeon','jungwon','karina','vernon','jihyo',
  'ning ning','jeongyeon','dino','felix'
];


const ADMIN_KEY = "SUPER_SECRET_2025"; // 🔴 CHANGE THIS

export async function onRequestGet({ env, request }) {
  let totalVotes = 0;
  const counts = {};

  // Fetch votes
  for (const d of DRIVERS) {
    const v = parseInt(await env.VOTES.get(`vote_${d}`)) || 0;
    counts[d] = v;
    totalVotes += v;
  }

  // Calculate percentages
  const percentages = {};
  for (const d of DRIVERS) {
    percentages[d] = totalVotes === 0
      ? 0
      : Number(((counts[d] / totalVotes) * 100).toFixed(2));
  }

  // Check admin access
  const url = new URL(request.url);
  const isAdmin = url.searchParams.get("key") === ADMIN_KEY;

  // Public response
  const response = {
    percentages
  };

  // Admin-only data
  if (isAdmin) {
    response.totalVotes = totalVotes;
    response.rawCounts = counts; // optional but useful
  }

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" }
  });
}
