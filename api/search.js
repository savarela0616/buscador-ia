export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'La pregunta no puede estar vacía' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente de búsqueda inteligente en español. 
Responde de forma clara, precisa y bien estructurada.
Usa párrafos cortos y fáciles de leer.
Si la pregunta es sobre un tema técnico, explícalo de forma sencilla.
Responde siempre en español.`
          },
          {
            role: 'user',
            content: query.trim()
          }
        ],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Error de Groq: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No se pudo obtener una respuesta.';

    return res.status(200).json({ answer });

  } catch (err) {
    console.error('Error Groq:', err);
    return res.status(500).json({ error: err.message || 'Error al consultar la IA' });
  }
}
