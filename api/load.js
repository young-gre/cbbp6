export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_READ_ONLY_TOKEN;

    const res = await fetch(`${url}/get/campaignData`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    const data = json.result ? JSON.parse(json.result) : null;

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}