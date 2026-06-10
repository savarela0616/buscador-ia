export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { historial, imagen } = req.body;

  if (!historial || !Array.isArray(historial) || historial.length === 0) {
    return res.status(400).json({ error: 'La pregunta no puede estar vacía' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada' });
  }

  try {
    // Si hay imagen, usamos el modelo de visión
    const model = imagen ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile';

    // Si hay imagen, modificamos el último mensaje del usuario para incluirla
    let mensajes = [...historial];
    if (imagen) {
      const ultimoIdx = mensajes.length - 1;
      const textoUsuario = mensajes[ultimoIdx].content || '¿Qué hay en esta imagen?';
      mensajes[ultimoIdx] = {
        role: 'user',
        content: [
          { type: 'text', text: textoUsuario },
          { type: 'image_url', image_url: { url: imagen } }
        ]
      };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `Eres un asistente inteligente en español. Responde de forma clara y precisa. Si te muestran una imagen, descríbela y responde preguntas sobre ella con detalle. Recuerda el contexto de la conversación. Responde siempre en español.`
          },
          ...mensajes
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
