import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { date, time, patients } = await request.json();

    // Usar Google Generative AI (Gemini) o fallback a mensaje estático
    const prompt = `Genera un mensaje profesional y amable en español para confirmar una cita médica con los siguientes detalles:
- Fecha: ${date}
- Hora: ${time}
- Paciente(s): ${patients}

El mensaje debe:
1. Ser cordial y profesional
2. Incluir instrucciones claras
3. Tener no más de 150 palabras
4. Indicar qué traer y cómo prepararse
5. Incluir número de emergencia si es necesario`;

    // Intentar usar Gemini API si está configurada
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (generatedText) {
            return NextResponse.json({
              message: generatedText,
              success: true,
            });
          }
        }
      } catch (error) {
        console.warn('Gemini API error, using fallback:', error);
      }
    }

    // Mensaje fallback si IA no está disponible o falla
    const fallbackMessage = `Hola ${patients},

Tu cita ha sido programada para el ${date} a las ${time} hrs.

Por favor confirma tu asistencia respondiendo este mensaje.

📍 Ubicación: [Dirección de la clínica]
📞 Teléfono: [Número de contacto]

⚠️ Notas importantes:
- Por favor llega 10 minutos antes de tu cita
- Trae contigo una identificación oficial
- Si necesitas cancelar, háznoslo saber con 24 horas de anticipación
- Asegúrate de traer tus documentos médicos si es necesario

¡Te esperamos!`;

    return NextResponse.json({
      message: fallbackMessage,
      success: true,
    });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Error al generar el mensaje' },
      { status: 500 }
    );
  }
}
