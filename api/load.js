export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_READ_ONLY_TOKEN;

    const res = await fetch(`${url}/get/campaignData`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();

    // Upstash는 { result: "값" } 형태로 반환
    let data = null;
    if (json.result) {
      try {
        data = JSON.parse(json.result);
      } catch(e) {
        data = json.result;
      }
    }

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