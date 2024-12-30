const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');

// Inicialização do cliente
const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

// Função de delay
const delay = ms => new Promise(res => setTimeout(res, ms));

// Respostas padrão para as opções do menu
const responses = {
    "1": {
        title: "Lash lifting",
        message: `Lash Lifting é um procedimento estético que realça os cílios naturais, proporcionando uma curvatura mais acentuada e duradoura sem a necessidade de extensões.

Ideal para quem busca um olhar mais definido e natural, o tratamento utiliza produtos específicos para levantar e moldar os fios, com resultados que podem durar de 6 a 8 semanas. Além de prático, ele elimina a necessidade de usar curvex ou máscara de cílios diariamente. <br> Link para cadastro: https://site.com`,

    },
    "2": {
        title: "Lash cílios",
        message: `Lash cílios são extensões que realçam o olhar, proporcionando mais volume, comprimento e definição aos cílios naturais. A técnica é personalizada, garantindo um resultado único e elegante, ideal para quem busca praticidade e beleza no dia a dia.

Link para cadastro: https://site.com`,
    },
    "3": {
        title: "Spa labial",
        message: `Spa labial é um tratamento que promove hidratação profunda, esfoliação e revitalização dos lábios. Ideal para suavizar rachaduras, melhorar a textura e realçar a beleza natural, deixando os lábios macios e saudáveis.

Link para cadastro: https://site.com`,
    },
    "4": {
        title: "Henna labial",
        message: `Henna labial é um procedimento que realça a cor natural dos lábios de forma temporária, proporcionando definição e um tom mais uniforme. Ideal para quem busca praticidade e lábios mais bonitos no dia a dia.
        
Acesse agora: https://site.com`,
    },
    "5": {
        title: "Designe de sobrancelha",
        message: `Design de sobrancelhas é a técnica que realça o formato natural das sobrancelhas, respeitando as características do rosto. Proporciona harmonia e expressão ao olhar, valorizando a beleza única de cada pessoa. Acesse agora: https://site.com`,
    },
};

// Função para enviar mensagens simulando digitação
const sendMessageWithTyping = async (chat, message) => {
    await chat.sendStateTyping();
    await delay(3000);
    await chat.clearState();
    await delay(1000);
    await chat.sendMessage(message);
};

// Funil de atendimento
client.on('message', async msg => {
    try {
        const chat = await msg.getChat();

        // Verifica se é uma saudação ou mensagem inicial
        if (
            /(menu|bom dia|boa tarde|boa noite|oi|olá|ola|hey|hello|tudo bem|sobrancelha|design|promoção|tratamento|beleza|estética|procedimento|agendar|marcação|horário|disponível|promoções|microblading|henna|cílios|alongamento de cílios|tintura|valor|preço|consultar|modelagem de sobrancelhas|serviço|agendamento|recepção|estilo|saúde|higiene|peeling|laser|depilação|cuidados com a pele|maquiagem|técnica|beleza natural|realce|rejuvenescimento|hidratação|limpeza de pele|spa|esfoliação|massagem|relaxamento|drenagem linfática|clareamento|manchas|acne|tratamento capilar|alopecia|botox|preenchimento|harmonização facial|lifting|toxina botulínica|colágeno|ácido hialurônico|olheiras|linhas de expressão|reparação|renovação|bioestimuladores|lifting labial|cuidados pessoais|bem-estar|autoestima|dicas de beleza|tutorial|promoção especial|novidade|evento|campanha|atendimento|consultoria|produtos|oferta|exclusivo|benefício|cuidado facial|estilo de vida|transformação|resgate da beleza|serum|rotina de beleza|nutrição da pele|anti-idade|clareamento dental|autoimagem|pele perfeita|consultoria estética|atendimento personalizado|confiança|expressão facial|lábios hidratados|sobrancelhas definidas|cílios volumosos|pele radiante|beleza holística)/i.test(msg.body)
        ) {

            const contact = await msg.getContact();
            const name = contact.pushname || "Cliente";
            await sendMessageWithTyping(
                chat,
                `Olá ${name.split(" ")[0]}! Sou o assistente virtual da Lana Lopes. Como posso ajudá-la hoje? Escolha uma das opções abaixo:\n\n` +
                `1 - Lash lifting\n2 - Lash cílios\n3 - Spa labial\n4 - Henna labial\n5 - Designe de sobrancelha simples`
            );
            return;
        }

        // Responde com base nas opções do menu
        if (responses[msg.body]) {
            await sendMessageWithTyping(chat, responses[msg.body].message);
        } else {
            // Caso a mensagem não corresponda a nenhuma opção válida
            await sendMessageWithTyping(chat, "Por favor, inicie a conversa digitando 'Oi' para falar com minha assistente virtual. Estou à disposição para ajudar!");
        }
    } catch (error) {
        console.error("Erro ao processar a mensagem:", error);
    }
});
