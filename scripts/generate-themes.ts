import * as fs from 'fs';

const THEMES: { name: string; words: string[] }[] = [
  { name: 'Animais 🐾', words: ['GATO', 'CACHORRO', 'LEAO', 'TIGRE', 'URSO', 'LOBO', 'RAPOSA', 'COELHO', 'RATO', 'CAVALO', 'VACA', 'PORCO', 'OVELHA', 'CABRA', 'GALINHA', 'PATO', 'GANSO', 'PERU', 'PAVAO', 'AGUIA', 'FALCAO', 'CORUJA', 'POMBA', 'PARDAL', 'PAPAGAIO', 'ARARA', 'TUCANO', 'PINGUIM', 'FOCA', 'BALEIA', 'GOLFINHO', 'TUBARAO', 'POLVO', 'LULA', 'CARANGUEJO', 'LAGOSTA', 'CAMARAO', 'TARTARUGA', 'JACARE', 'CROCODILO', 'COBRA', 'LAGARTO', 'IGUANA', 'SAPO', 'SALAMANDRA', 'FORMIGA', 'ABELHA', 'BORBOLETA', 'JOANINHA', 'GRILO', 'CIGARRA', 'LIBELULA', 'ESCORPIAO', 'ARANHA', 'MORCEGO', 'ESQUILO', 'CASTOR', 'LONTRA', 'TEXUGO', 'FURÃO', 'DONINHA', 'JAVALI', 'ALCE', 'CERVO', 'VEADO', 'ANTILOPE', 'ZEBRA', 'GIRAFA', 'ELEFANTE', 'RINOCERONTE', 'HIPOPOTAMO', 'GORILA', 'CHIMPANZE', 'ORANGOTANGO', 'MACACO', 'LÊMURE', 'PREGUICA', 'TATU', 'TAMANDUÁ', 'CAPIVARA', 'PACA', 'CUTIA', 'ANTA', 'ONÇA', 'JAGUAR', 'LEOPARDO', 'GUEPARDO', 'PANTERA', 'LINCE', 'PUMA', 'HIENA', 'CHACAL', 'CANGURU', 'COALA', 'ORNITORRINCO', 'EQUIDNA', 'EMU', 'AVESTRUZ', 'FLAMINGO', 'PELICANO', 'CEGONHA', 'GARÇA'] },
  { name: 'Frutas 🍎', words: ['MACA', 'BANANA', 'LARANJA', 'LIMAO', 'UVA', 'MORANGO', 'MELANCIA', 'MELAO', 'ABACAXI', 'MANGA', 'MAMAO', 'GOIABA', 'PERA', 'PESSEGO', 'AMEIXA', 'CEREJA', 'FRAMBOESA', 'AMORA', 'KIWI', 'COCO', 'ABACATE', 'CAJU', 'ACEROLA', 'JABUTICABA', 'PITANGA', 'GRAVIOLA', 'MARACUJA', 'CARAMBOLA', 'FIGO', 'ROMA', 'TANGERINA', 'LIMA', 'POMELO', 'NECTARINA', 'DAMASCO', 'LICHIA', 'TAMARINDO', 'JACA', 'CUPUACU', 'ACAI', 'CAQUI', 'MIRTILO', 'GROSELHA', 'PHYSALIS', 'PITAYA', 'RAMBUTÃ', 'MANGOSTAO', 'DURIÃO', 'SAPOTI', 'SERIGUELA', 'CAJÁ', 'UMBU', 'MURICI', 'BACURI', 'PUPUNHA', 'TUCUMA', 'BURITI', 'PEQUI', 'GUARANA', 'CACAU'] },
  { name: 'Cores 🎨', words: ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO', 'LARANJA', 'ROXO', 'ROSA', 'MARROM', 'PRETO', 'BRANCO', 'CINZA', 'BEGE', 'DOURADO', 'PRATEADO', 'TURQUESA', 'VIOLETA', 'MAGENTA', 'CIANO', 'CORAL', 'SALMON', 'LAVANDA', 'LILAS', 'CARMIM', 'ESCARLATE', 'BORGONHA', 'VINHO', 'OCRE', 'SEPIA', 'INDIGO', 'COBALTO', 'SAFIRA', 'ESMERALDA', 'JADE', 'OLIVA', 'MOSTARDA', 'TERRACOTA', 'FERRUGEM', 'BRONZE', 'COBRE', 'PEROLA'] },
  { name: 'Profissões 👨‍💼', words: ['MEDICO', 'ADVOGADO', 'ENGENHEIRO', 'PROFESSOR', 'DENTISTA', 'ENFERMEIRO', 'ARQUITETO', 'CONTADOR', 'PROGRAMADOR', 'DESIGNER', 'JORNALISTA', 'FOTOGRAFO', 'COZINHEIRO', 'PADEIRO', 'ACOUGUEIRO', 'PEDREIRO', 'ELETRICISTA', 'ENCANADOR', 'MARCENEIRO', 'MECANICO', 'MOTORISTA', 'PILOTO', 'BOMBEIRO', 'POLICIAL', 'SOLDADO', 'JUIZ', 'PROMOTOR', 'DELEGADO', 'VETERINARIO', 'PSICOLOGO', 'FISIOTERAPEUTA', 'FARMACEUTICO', 'BIOLOGO', 'QUIMICO', 'FISICO', 'MATEMATICO', 'ECONOMISTA', 'SOCIOLOGO', 'FILOSOFO', 'HISTORIADOR', 'GEOGRAFO', 'ASTRONOMO', 'GEOLOGO', 'AGRONOMO', 'ZOOTECNISTA', 'NUTRICIONISTA', 'FONOAUDIOLOGO', 'TERAPEUTA', 'PSIQUIATRA', 'CIRURGIAO'] },
  { name: 'Esportes ⚽', words: ['FUTEBOL', 'BASQUETE', 'VOLEI', 'TENIS', 'NATACAO', 'ATLETISMO', 'GINASTICA', 'BOXE', 'JUDO', 'KARATE', 'TAEKWONDO', 'ESGRIMA', 'CICLISMO', 'HIPISMO', 'GOLFE', 'SURFE', 'SKATE', 'PATINACAO', 'ESQUI', 'SNOWBOARD', 'HANDEBOL', 'RUGBY', 'BEISEBOL', 'SOFTBOL', 'HOQUEI', 'POLO', 'REMO', 'CANOAGEM', 'VELA', 'MERGULHO', 'TRIATHLON', 'PENTATLO', 'DECATLO', 'MARATONA', 'CORRIDA', 'SALTO', 'ARREMESSO', 'LANCAMENTO', 'LUTA', 'WRESTLING', 'CAPOEIRA', 'JUDOCA', 'PUGILISMO', 'KICKBOXING', 'MUAYTHAI', 'JIUJITSU', 'AIKIDO', 'KENDO', 'SUMÔ', 'BADMINTON'] },
  { name: 'Música 🎵', words: ['VIOLAO', 'GUITARRA', 'BAIXO', 'BATERIA', 'PIANO', 'TECLADO', 'FLAUTA', 'CLARINETE', 'SAXOFONE', 'TROMPETE', 'TROMBONE', 'TUBA', 'VIOLINO', 'VIOLA', 'VIOLONCELO', 'CONTRABAIXO', 'HARPA', 'ACORDEAO', 'SANFONA', 'GAITA', 'PANDEIRO', 'TAMBOR', 'TRIANGULO', 'MARACAS', 'XILOFONE', 'CAVAQUINHO', 'BANDOLIM', 'UKULELE', 'BANJO', 'ALAUDE', 'CRAVO', 'ORGAO', 'SINTETIZADOR', 'MELODICA', 'OCARINA', 'BERIMBAU', 'CUICA', 'AGOGO', 'SURDO', 'ZABUMBA', 'REPIQUE', 'TIMBAL', 'CONGA', 'BONGO', 'DJEMBE', 'CAJON', 'CASTANHOLA', 'PRATOS', 'GONGO', 'SINO'] },
  { name: 'Comidas 🍔', words: ['ARROZ', 'FEIJAO', 'MACARRAO', 'LASANHA', 'PIZZA', 'HAMBURGUER', 'SANDUICHE', 'SALADA', 'SOPA', 'CALDO', 'CARNE', 'FRANGO', 'PEIXE', 'CAMARAO', 'OVO', 'QUEIJO', 'PRESUNTO', 'BACON', 'LINGUICA', 'SALSICHA', 'BATATA', 'MANDIOCA', 'INHAME', 'CENOURA', 'BETERRABA', 'CEBOLA', 'ALHO', 'TOMATE', 'ALFACE', 'RUCULA', 'AGRIAO', 'ESPINAFRE', 'COUVE', 'BROCOLIS', 'REPOLHO', 'PEPINO', 'ABOBRINHA', 'BERINJELA', 'PIMENTAO', 'MILHO', 'ERVILHA', 'LENTILHA', 'GRAODEBI', 'SOJA', 'AMENDOIM', 'CASTANHA', 'NOZ', 'AMÊNDOA', 'AVELA', 'PISTACHE'] },
  { name: 'Natureza 🌿', words: ['ARVORE', 'FLOR', 'FOLHA', 'RAIZ', 'TRONCO', 'GALHO', 'FRUTO', 'SEMENTE', 'GRAMA', 'MATO', 'FLORESTA', 'SELVA', 'BOSQUE', 'CAMPO', 'PRADO', 'MONTANHA', 'MORRO', 'COLINA', 'VALE', 'PLANICIE', 'DESERTO', 'PRAIA', 'MAR', 'OCEANO', 'RIO', 'LAGO', 'LAGOA', 'CACHOEIRA', 'NASCENTE', 'CORREGO', 'RIACHO', 'ILHA', 'PENINSULA', 'CONTINENTE', 'VULCAO', 'CAVERNA', 'GRUTA', 'ROCHEDO', 'PENHASCO', 'DUNAS', 'PANTANO', 'MANGUE', 'RECIFE', 'CORAL', 'ATOL', 'GLACIAR', 'ICEBERG', 'TUNDRA', 'SAVANA', 'ESTEPE'] },
  { name: 'Casa 🏠', words: ['SALA', 'QUARTO', 'COZINHA', 'BANHEIRO', 'VARANDA', 'GARAGEM', 'SOTAO', 'PORAO', 'JARDIM', 'QUINTAL', 'TERRACO', 'SACADA', 'CORREDOR', 'ESCADA', 'PORTA', 'JANELA', 'TELHADO', 'PAREDE', 'PISO', 'TETO', 'SOFA', 'POLTRONA', 'CADEIRA', 'MESA', 'CAMA', 'ARMARIO', 'ESTANTE', 'PRATELEIRA', 'GAVETA', 'ESPELHO', 'QUADRO', 'TAPETE', 'CORTINA', 'LUSTRE', 'ABAJUR', 'VENTILADOR', 'TELEVISAO', 'GELADEIRA', 'FOGAO', 'MICROONDAS', 'LIQUIDIFICADOR', 'BATEDEIRA', 'TORRADEIRA', 'CAFETEIRA', 'CHALEIRA', 'PANELA', 'FRIGIDEIRA', 'FORNO', 'PIA', 'TORNEIRA'] },
  { name: 'Corpo Humano 🧠', words: ['CABECA', 'CABELO', 'TESTA', 'SOBRANCELHA', 'OLHO', 'NARIZ', 'BOCA', 'LABIO', 'DENTE', 'LINGUA', 'ORELHA', 'PESCOCO', 'OMBRO', 'BRACO', 'COTOVELO', 'PULSO', 'MAO', 'DEDO', 'UNHA', 'PEITO', 'BARRIGA', 'COSTAS', 'CINTURA', 'QUADRIL', 'PERNA', 'COXA', 'JOELHO', 'CANELA', 'TORNOZELO', 'PE', 'CALCANHAR', 'CORACAO', 'PULMAO', 'FIGADO', 'RIM', 'ESTOMAGO', 'INTESTINO', 'CEREBRO', 'OSSO', 'MUSCULO', 'ARTERIA', 'VEIA', 'NERVO', 'TENDAO', 'CARTILAGEM', 'MEDULA', 'COLUNA', 'COSTELA', 'CRANIO', 'FEMUR'] },
  { name: 'Roupas 👕', words: ['CAMISA', 'CAMISETA', 'BLUSA', 'CASACO', 'JAQUETA', 'MOLETOM', 'SUETER', 'COLETE', 'VESTIDO', 'SAIA', 'CALCA', 'BERMUDA', 'SHORTS', 'JEANS', 'LEGGING', 'MEIA', 'CUECA', 'CALCINHA', 'SUTIA', 'PIJAMA', 'ROUPAO', 'BIQUINI', 'MAIO', 'SUNGA', 'TERNO', 'GRAVATA', 'SAPATO', 'TENIS', 'SANDALIA', 'CHINELO', 'BOTA', 'SAPATILHA', 'SALTO', 'CHAPEU', 'BONE', 'GORRO', 'CACHECOL', 'LUVA', 'CINTO', 'BOLSA', 'MOCHILA', 'CARTEIRA', 'RELOGIO', 'PULSEIRA', 'COLAR', 'BRINCO', 'ANEL', 'OCULOS', 'LENCO', 'ECHARPE'] },
  { name: 'Escola 📚', words: ['LIVRO', 'CADERNO', 'LAPIS', 'CANETA', 'BORRACHA', 'APONTADOR', 'REGUA', 'COMPASSO', 'ESQUADRO', 'TRANSFERIDOR', 'MOCHILA', 'ESTOJO', 'PASTA', 'FICHARIO', 'GRAMPEADOR', 'FURADOR', 'TESOURA', 'COLA', 'FITA', 'CLIPE', 'ALFINETE', 'LOUSA', 'GIZ', 'APAGADOR', 'CARTEIRA', 'PROFESSOR', 'ALUNO', 'DIRETOR', 'COORDENADOR', 'INSPETOR', 'BIBLIOTECA', 'LABORATORIO', 'QUADRA', 'PATIO', 'CANTINA', 'SECRETARIA', 'AULA', 'PROVA', 'TRABALHO', 'LICAO', 'DEVER', 'NOTA', 'BOLETIM', 'DIPLOMA', 'FORMATURA', 'RECREIO', 'INTERVALO', 'UNIFORME', 'MURAL', 'GLOBO'] },
  { name: 'Tecnologia 💻', words: ['COMPUTADOR', 'NOTEBOOK', 'TABLET', 'CELULAR', 'SMARTPHONE', 'MONITOR', 'TECLADO', 'MOUSE', 'IMPRESSORA', 'SCANNER', 'WEBCAM', 'MICROFONE', 'FONE', 'CAIXA', 'PENDRIVE', 'DISCO', 'MEMORIA', 'PROCESSADOR', 'PLACA', 'CABO', 'CARREGADOR', 'BATERIA', 'INTERNET', 'WIFI', 'BLUETOOTH', 'SOFTWARE', 'HARDWARE', 'APLICATIVO', 'PROGRAMA', 'SISTEMA', 'ARQUIVO', 'PASTA', 'DOCUMENTO', 'PLANILHA', 'APRESENTACAO', 'EMAIL', 'MENSAGEM', 'REDE', 'SERVIDOR', 'NUVEM', 'BACKUP', 'DOWNLOAD', 'UPLOAD', 'STREAMING', 'PIXEL', 'RESOLUCAO', 'ALGORITMO', 'CODIGO', 'BANCO', 'DADOS'] },
  { name: 'Veículos 🚗', words: ['CARRO', 'MOTO', 'BICICLETA', 'ONIBUS', 'CAMINHAO', 'VAN', 'KOMBI', 'PICKUP', 'JIPE', 'SUV', 'SEDAN', 'HATCH', 'CONVERSIVEL', 'LIMOUSINE', 'AMBULANCIA', 'TAXI', 'TREM', 'METRO', 'BONDE', 'AVIAO', 'HELICOPTERO', 'DRONE', 'NAVIO', 'BARCO', 'LANCHA', 'IATE', 'VELEIRO', 'CANOA', 'CAIAQUE', 'PATINETE', 'TRICICLO', 'QUADRICICLO', 'TRATOR', 'ESCAVADEIRA', 'GUINCHO', 'EMPILHADEIRA', 'CARROCA', 'CHARRETE', 'BONDE', 'TELEFÉRICO', 'FUNICULAR', 'MONOTRILHO', 'DIRIGIVEL', 'BALAO', 'PLANADOR', 'ULTRALEVE', 'JATO', 'FOGUETE', 'SATELITE', 'SONDA'] },
  { name: 'Tempo ⏰', words: ['SEGUNDO', 'MINUTO', 'HORA', 'DIA', 'SEMANA', 'MES', 'ANO', 'DECADA', 'SECULO', 'MILENIO', 'MANHA', 'TARDE', 'NOITE', 'MADRUGADA', 'AMANHECER', 'ANOITECER', 'CREPUSCULO', 'AURORA', 'ONTEM', 'HOJE', 'AMANHA', 'PASSADO', 'PRESENTE', 'FUTURO', 'ANTIGO', 'MODERNO', 'ATUAL', 'RELOGIO', 'CALENDARIO', 'AGENDA', 'CRONOMETRO', 'AMPULHETA', 'ALARME', 'DESPERTADOR', 'FUSO', 'HORARIO', 'DATA', 'PRAZO', 'PERIODO', 'ESTACAO', 'PRIMAVERA', 'VERAO', 'OUTONO', 'INVERNO', 'BIMESTRE', 'TRIMESTRE', 'SEMESTRE', 'QUINZENA', 'LUSTRO', 'ERA'] },
  { name: 'Clima ☀️', words: ['SOL', 'LUA', 'ESTRELA', 'NUVEM', 'CHUVA', 'NEVE', 'GRANIZO', 'GEADA', 'NEBLINA', 'NEVOA', 'ORVALHO', 'VENTO', 'BRISA', 'VENDAVAL', 'FURACAO', 'TORNADO', 'CICLONE', 'TUFAO', 'TEMPESTADE', 'TROVAO', 'RAIO', 'RELAMPAGO', 'ARCOIRIS', 'UMIDADE', 'TEMPERATURA', 'CALOR', 'FRIO', 'QUENTE', 'GELADO', 'MORNO', 'FRESCO', 'ABAFADO', 'SECO', 'UMIDO', 'TROPICAL', 'POLAR', 'EQUATORIAL', 'TEMPERADO', 'CONTINENTAL', 'MARITIMO', 'MONÇÃO', 'SERENO', 'NEVOEIRO', 'GAROA', 'CHUVISCO', 'TEMPORAL', 'DILUVIO', 'SECA', 'ESTIAGEM', 'ENCHENTE'] },
  { name: 'Família 👨‍👩‍👧‍👦', words: ['PAI', 'MAE', 'FILHO', 'FILHA', 'IRMAO', 'IRMA', 'AVO', 'NETO', 'NETA', 'TIO', 'TIA', 'PRIMO', 'PRIMA', 'SOBRINHO', 'SOBRINHA', 'PADRINHO', 'MADRINHA', 'AFILHADO', 'AFILHADA', 'SOGRO', 'SOGRA', 'GENRO', 'NORA', 'CUNHADO', 'CUNHADA', 'ENTEADO', 'ENTEADA', 'PADRASTO', 'MADRASTA', 'BISAVO', 'BISNETO', 'BISNETA', 'MARIDO', 'ESPOSA', 'NOIVO', 'NOIVA', 'NAMORADO', 'NAMORADA', 'CASAL', 'GEMEO', 'TRIGÊMEO', 'ADOTIVO', 'TUTOR', 'PUPILO', 'HERDEIRO', 'PARENTE', 'FAMILIAR', 'ANCESTRAL', 'DESCENDENTE', 'LINHAGEM'] },
  { name: 'Países 🌍', words: ['BRASIL', 'ARGENTINA', 'CHILE', 'URUGUAI', 'PARAGUAI', 'BOLIVIA', 'PERU', 'EQUADOR', 'COLOMBIA', 'VENEZUELA', 'MEXICO', 'CANADA', 'PORTUGAL', 'ESPANHA', 'FRANCA', 'ITALIA', 'ALEMANHA', 'INGLATERRA', 'IRLANDA', 'ESCOCIA', 'HOLANDA', 'BELGICA', 'SUICA', 'AUSTRIA', 'GRECIA', 'TURQUIA', 'RUSSIA', 'CHINA', 'JAPAO', 'COREIA', 'INDIA', 'AUSTRALIA', 'EGITO', 'MARROCOS', 'NIGERIA', 'QUENIA', 'ANGOLA', 'MOCAMBIQUE', 'SUECIA', 'NORUEGA', 'DINAMARCA', 'FINLANDIA', 'ISLANDIA', 'POLONIA', 'UCRANIA', 'HUNGRIA', 'ROMENIA', 'CROACIA', 'SERVIA', 'CUBA'] },
  { name: 'Sentimentos 💖', words: ['AMOR', 'ODIO', 'ALEGRIA', 'TRISTEZA', 'RAIVA', 'MEDO', 'CORAGEM', 'ESPERANCA', 'SAUDADE', 'PAIXAO', 'CARINHO', 'AFETO', 'TERNURA', 'GRATIDAO', 'ORGULHO', 'VERGONHA', 'CULPA', 'INVEJA', 'CIUME', 'ANSIEDADE', 'ANGUSTIA', 'DESESPERO', 'EUFORIA', 'ENTUSIASMO', 'EMPOLGACAO', 'TEDIO', 'APATIA', 'MELANCOLIA', 'NOSTALGIA', 'SERENIDADE', 'PAZ', 'HARMONIA', 'FELICIDADE', 'SATISFACAO', 'PRAZER', 'DOR', 'SOFRIMENTO', 'MAGOA', 'RESSENTIMENTO', 'PERDAO', 'COMPAIXAO', 'EMPATIA', 'SIMPATIA', 'ANTIPATIA', 'ADMIRACAO', 'DESPREZO', 'NOJO', 'SURPRESA', 'CONFUSAO', 'CURIOSIDADE'] },
  { name: 'Números 🔢', words: ['ZERO', 'UM', 'DOIS', 'TRES', 'QUATRO', 'CINCO', 'SEIS', 'SETE', 'OITO', 'NOVE', 'DEZ', 'ONZE', 'DOZE', 'TREZE', 'QUATORZE', 'QUINZE', 'DEZESSEIS', 'DEZESSETE', 'DEZOITO', 'DEZENOVE', 'VINTE', 'TRINTA', 'QUARENTA', 'CINQUENTA', 'SESSENTA', 'SETENTA', 'OITENTA', 'NOVENTA', 'CEM', 'MIL', 'MILHAO', 'BILHAO', 'TRILHAO', 'PRIMEIRO', 'SEGUNDO', 'TERCEIRO', 'QUARTO', 'QUINTO', 'METADE', 'DOBRO', 'TRIPLO', 'QUADRUPLO', 'QUINTUPLO', 'DEZENA', 'CENTENA', 'MILHAR', 'DÚZIA', 'PAR', 'IMPAR', 'FRACAO'] },
];

function normalize(word: string): string {
  return word
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function loadDictionary(path: string): string[] {
  const content = fs.readFileSync(path, 'utf-8');
  return content.split('\n').map(w => w.trim()).filter(w => w.length >= 4 && w.length <= 15);
}

function filterWordsByPrefix(words: string[], prefixes: string[]): string[] {
  const normalized = prefixes.map(p => normalize(p));
  return words.filter(word => {
    const norm = normalize(word);
    return normalized.some(prefix => norm.startsWith(prefix) || norm.includes(prefix));
  });
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let m = result.length;
  let t: T;
  let i: number;
  
  let s = seed;
  const random = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  
  while (m) {
    i = Math.floor(random() * m--);
    t = result[m]!;
    result[m] = result[i]!;
    result[i] = t;
  }
  
  return result;
}

function selectWords(words: string[], count: number, minLen: number, maxLen: number, seed: number): string[] {
  const filtered = words.filter(w => {
    const len = normalize(w).length;
    return len >= minLen && len <= maxLen;
  });
  const shuffled = shuffleArray(filtered, seed);
  const unique = new Set<string>();
  const result: string[] = [];
  
  for (const word of shuffled) {
    const norm = normalize(word);
    if (!unique.has(norm) && result.length < count) {
      unique.add(norm);
      result.push(norm);
    }
  }
  
  return result;
}

function generateThemeData(themeWords: string[], seed: number): { easy: string[]; medium: string[]; hard: string[] } {
  return {
    easy: selectWords(themeWords, 10, 4, 8, seed),
    medium: selectWords(themeWords, 12, 5, 10, seed + 1000),
    hard: selectWords(themeWords, 15, 6, 15, seed + 2000),
  };
}

function main() {
  const startDate = new Date('2026-01-01');
  const inserts: string[] = [];
  
  for (let day = 0; day < 365; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    const themeIndex = day % THEMES.length;
    const theme = THEMES[themeIndex]!;
    
    const data = generateThemeData(theme.words, day * 12345);
    const dataJson = JSON.stringify(data).replace(/'/g, "''");
    
    inserts.push(
      `INSERT INTO wordsearch_themes (path, challenge_date, theme, data) VALUES ('wordsearch/${dateStr}', '${dateStr}', '${theme.name}', '${dataJson}');`
    );
  }
  
  fs.writeFileSync('themes-insert.sql', inserts.join('\n'), 'utf-8');
  console.log(`Generated ${inserts.length} INSERT statements to themes-insert.sql`);
}

main();
