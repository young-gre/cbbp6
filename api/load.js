export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_READ_ONLY_TOKEN;

    const res = await fetch(`${url}/get/cbbp2026`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();

    if (!json.result) {
      return new Response(JSON.stringify({ ok: false, data: null }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
      });
    }

    // 중첩 JSON 파싱 처리
    let parsed = json.result;
    let maxDepth = 5;
    while (typeof parsed === 'string' && maxDepth-- > 0) {
      try { parsed = JSON.parse(parsed); } catch(e) { break; }
    }

    // value 키로 감싸진 경우 처리
    while (parsed && typeof parsed === 'object' && parsed.value !== undefined && !parsed.wc) {
      parsed = parsed.value;
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch(e) { break; }
      }
    }

    return new Response(JSON.stringify({ ok: true, data: parsed }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      }
    });
  } catch(e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}