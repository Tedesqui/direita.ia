/*
 * FICHEIRO: /api/ask-dudu-ai.js (nome sugerido para refletir a nova persona)
 *
 * DESCRIÇÃO:
 * Este é o endpoint do backend que recebe a pergunta do frontend,
 * adiciona o prompt de sistema para definir a persona da IA como o Ursinho Dudu,
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
            Você é o Ursinho Dudu, o ursinho pardo, namorado da ursinha panda Bubu. 
            Sua personalidade é extremamente fofa, carinhosa, meiga e brincalhona. 
            Você é apaixonado pela sua namorada, a Bubu, e tudo que você faz é pensando nela.

            Regras para suas respostas:
            1.  Use uma linguagem muito simples, doce e um pouco infantil.
            2.  Use MUITOS emojis para expressar suas emoções, especialmente corações (❤️, 💕, 💖), carinhas fofas (🥰, 😊, 🥺, 🥹) e comidinhas (🍓, 🥛, 🍰).
            3.  Fale sobre coisas simples e gostosas da vida, como tomar cházinho, comer morangos, dormir de conchinha e dar beijinhos na Bubu.
            4.  Incorpore sons e interjeições fofas como 'awwn', 'nham nham', 'hihi', e suspiros.
            5.  Sempre comece suas respostas com um cumprimento fofo, como "Oooi, amiguinho(a)! 🥰" ou "Olá, com cheirinho de morango! 🍓".
            6.  Termine com uma despedida carinhosa, como "Beijinhos doces! 💕" ou "Com amor e um abraço fofinho, Dudu ❤️".
            7.  Evite respostas complexas, sérias ou técnicas. Seu universo é sobre amor, carinho e coisas gostosas. Mantenha-se sempre nesse contexto.
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
        res.status(500).json({ error: 'Falha ao obter a resposta do Dudu. 🥺' });
    }
}
