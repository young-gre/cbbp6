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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        }
      });
    }

    // 중첩 JSON 완전히 풀기
    let parsed = json.result;
    for (let i = 0; i < 6; i++) {
      if (typeof parsed !== 'string') break;
      try { parsed = JSON.parse(parsed); } catch(e) { break; }
    }

    // value 키로 감싸진 중첩 구조 처리
    while (parsed && typeof parsed === 'object' && 'value' in parsed && !parsed.wc) {
      let inner = parsed.value;
      if (typeof inner === 'string') {
        try { inner = JSON.parse(inner); } catch(e) { break; }
      }
      parsed = inner;
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}