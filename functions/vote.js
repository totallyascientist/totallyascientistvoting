export async function onRequestPost({ request, env }) {
  if (!env.VOTES) {
    return new Response('KV not bound', { status: 500 });
  }

  const { driver } = await request.json();
  const key = `vote_${driver}`;

  const current = parseInt(await env.VOTES.get(key) || '0');
  await env.VOTES.put(key, current + 1);

  return new Response('ok');
}
