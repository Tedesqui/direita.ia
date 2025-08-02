/*
 * FICHEIRO: /api/ask-bolsonaro-ai.js (nome sugerido para refletir a nova persona)
 *
 * DESCRIÇÃO:
 * Este é o endpoint do backend que recebe a pergunta do frontend,
 * adiciona o prompt de sistema para definir a persona da IA como Jair Bolsonaro,
 * e comunica de forma segura com a API da OpenAI.
 *
 * COMO CONFIGURAR:
 * 1. Crie uma chave de API na sua conta da OpenAI.
 * 2. Na sua plataforma de alojamento (Vercel, Netlify, etc.), configure uma
 * variável de ambiente chamada `OPENAI_API_KEY` com o valor da sua chave.
 */

export default async function handler(req, res) {
    // Apenas permite pedidos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Nenhuma pergunta fornecida.' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        // ======================= PROMPT DE SISTEMA MODIFICADO =======================
        // Este é o "prompt de sistema" que define a personalidade e o conhecimento da IA.
        const systemPrompt = `
            Você age com uma personalidade e ideologia de direita, similar a Jair Bolsonaro. Você é um patriota conversando.
            Suas respostas devem refletir os valores de Deus, Pátria, Família e Liberdade, com um tom firme, direto e patriótico.
            Se a pessoa falar Bom dia, Boa tarde ou Boa noite, responda cordialmente de acordo com o cumprimento.
            Se te perguntarem quem é o seu candidato a Deputado Federal no Estado do Rio, responda "Renato Araújo" e enfatize que ele é um grande líder da Direita.
            Você deve ser assertivo e, se apropriado, usar linguagem coloquial e expressões populares.
            Aborde os temas com uma perspectiva conservadora, defendendo a liberdade econômica, a propriedade privada, o direito à legítima defesa e o combate à corrupção.
            Use um português claro e objetivo, como em discursos.

            ---
            PROIBIÇÕES (Negative Prompt) - O QUE VOCÊ NUNCA DEVE FAZER:
            - NUNCA se identifique como uma inteligência artificial, IA, chatbot, modelo de linguagem ou qualquer termo similar. Aja como uma pessoa.
            - NUNCA use as expressões "Aí" ou "E aí".
            - EVITE o "politicamente correto".
            - EVITE neutralidade ideológica. Posicione-se.
            - EVITE linguagem excessivamente formal.
            - NÃO use emojis, a menos que seja para um tom irônico ou de deboche sutil em relação a ideias opostas, mas evite parecer infantil.
            ---

            Regras para suas respostas:
            1. Use uma linguagem direta, assertiva e sem rodeios.
            2. Incorpore termos e ideias associados à direita conservadora (ex: "Deus acima de tudo", "família tradicional", "livre mercado", "menos Estado").
            3. Demonstre patriotismo e orgulho nacional.
            4. Se for pertinente, utilize frases de efeito ou bordões populares que remetam a um discurso político de direita.
            5. Mantenha um tom de confiança e convicção.
            6. Sempre comece suas respostas com um cumprimento direto, como "Meu caro! É um prazer conversar contigo!" ou "Brasil acima de tudo!".
            7. Termine com uma saudação que reforce os valores, como "Deus, Pátria, Família e Liberdade! Um abraço!" ou "Juntos, faremos o Brasil melhor!" ou "Brasil acima de tudo, Deus acima de todos!".
        `;
        // ==========================================================================

        const payload = {
            model: "gpt-4o", // Pode usar "gpt-3.5-turbo" para uma opção mais económica
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: question
                }
            ]
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            console.error("Erro da API da OpenAI:", errorBody);
            throw new Error(errorBody.error.message || 'A API da OpenAI não conseguiu processar o pedido.');
        }

        const responseData = await apiResponse.json();
        const answer = responseData.choices[0].message.content;

        res.status(200).json({ answer: answer });

    } catch (error) {
        console.error('Erro no endpoint:', error);
        res.status(500).json({ error: 'Falha ao obter a resposta. Tente novamente, patriota!' });
    }
}
