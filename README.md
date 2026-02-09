# Pizzapp Word Search

Um caça-palavras online com geração diária automática, três níveis de dificuldade e interação por arrastar o mouse.

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

O projeto estará disponível em `http://localhost:3000`.

## 📋 Configuração

Copie o arquivo `.env.example` para `.env` e configure a URL da API:

```bash
cp .env.example .env
```

```env
VITE_API_URL=https://sua-api.com
```

Se a API não estiver configurada, o jogo usará um tema de fallback para desenvolvimento.

## 🗓️ Geração Diária

O puzzle é **determinístico** baseado na data UTC:

- **Mesmo dia** → **Mesmo puzzle**
- **Dia diferente** → **Puzzle diferente**

### Como funciona

1. A data UTC atual é convertida para string no formato `YYYY-MM-DD`
2. Essa string é transformada em um número (seed) usando uma função hash
3. O seed alimenta um PRNG (Mulberry32) que gera números pseudo-aleatórios
4. Todas as decisões do algoritmo (posição das palavras, direções, letras de preenchimento) usam esse PRNG

```typescript
// src/engine/seed.ts
export function getDailySeed(): number {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0]; // "2025-02-09"
  return dateStringToSeed(dateString);
}
```

## 📦 Carregamento de Temas

Os temas são carregados de uma API HTTP com o seguinte contrato:

```http
POST /api/query
Content-Type: application/json

{
  "sql": "SELECT * FROM themes WHERE path = ?",
  "params": ["wordsearch/2025-02-09"]
}
```

### Formato do JSON de Resposta

```typescript
type DailyTheme = {
  theme: string;           // Nome do tema (ex: "Animais")
  levels: {
    easy: string[];        // Palavras para nível fácil
    medium: string[];      // Palavras para nível médio
    hard: string[];        // Palavras para nível difícil
  };
};
```

O path no banco segue o padrão: `wordsearch/YYYY-MM-DD`

## 🧠 Algoritmo do Caça-Palavras

### Arquitetura

A engine é **completamente independente do React**. Toda a lógica de geração e validação está em `src/engine/`:

```
src/engine/
├── types.ts        # Tipos TypeScript
├── seed.ts         # Geração de seed diário
├── rng.ts          # PRNG Mulberry32
├── directions.ts   # Direções permitidas por dificuldade
├── gridGenerator.ts # Geração do puzzle completo
├── wordPlacer.ts   # Colocação de palavras no grid
└── solver.ts       # Validação de seleções
```

### Regras por Dificuldade

| Dificuldade | Grid | Direções | Invertidas |
|-------------|------|----------|------------|
| Fácil       | 10×10 | Horizontal, Vertical | Não |
| Médio       | 12×12 | Horizontal, Vertical, Diagonal | Não |
| Difícil     | 15×15 | Todas as 8 direções | Sim |

### Processo de Geração

1. **Ordenação**: Palavras são ordenadas por tamanho (maiores primeiro)
2. **Embaralhamento**: Lista é embaralhada usando o PRNG
3. **Colocação**: Para cada palavra:
   - Tenta todas as posições e direções (embaralhadas)
   - Verifica conflitos com letras já colocadas
   - Permite sobreposição se a letra for a mesma
4. **Preenchimento**: Células vazias recebem letras baseadas na frequência do português:
   ```
   aeosridmntcuvlpgqbfhãôâçêjéóxúíáàwky
   ```

### Validação de Seleção

1. Verifica se a seleção forma uma linha reta (horizontal, vertical ou diagonal)
2. Extrai as letras da seleção
3. Compara com as palavras colocadas
4. Verifica se a posição inicial e final correspondem

## 🎮 Interação

- **Clique + Arrastar**: Seleciona células em linha reta
- **Soltar**: Valida a seleção
- **Palavra encontrada**: Fica destacada em verde
- **Mostrar Solução**: Destaca todas as palavras e desativa interação

## 🔧 Extensibilidade

### Adicionar Novos Modos

1. **Novo tipo de dificuldade**: Adicione em `src/engine/types.ts` e configure em `src/engine/directions.ts`

2. **Modo cronometrado**: Adicione um componente `Timer` e estado no `DailyPuzzlePage`

3. **Modo multiplayer**: A engine é stateless, então pode ser usada para validar jogadas de múltiplos jogadores

4. **Temas personalizados**: Modifique `puzzleService.ts` para aceitar temas do usuário

### Estrutura de Componentes

```
src/
├── app/
│   ├── App.tsx              # Layout principal
│   └── DailyPuzzlePage.tsx  # Página do puzzle diário
├── components/
│   ├── Grid.tsx             # Grid do caça-palavras
│   ├── Cell.tsx             # Célula individual
│   ├── WordList.tsx         # Lista de palavras
│   ├── DifficultySelector.tsx
│   └── SolutionButton.tsx
├── engine/                  # Lógica pura (sem React)
├── services/
│   └── puzzleService.ts     # Comunicação com API
└── styles/                  # CSS Modules
```

## 📝 Regras de Negócio

- ❌ Não usa IA para gerar palavras
- ❌ Não hardcoda temas (exceto fallback para dev)
- ❌ Não salva progresso do usuário
- ❌ Não expõe segredos no frontend
- ✅ Engine desacoplada da UI
- ✅ Código tipado com TypeScript strict
- ✅ 100% client-side

## 🛠️ Stack

- **React 18** + **Vite**
- **TypeScript** (strict: true)
- **CSS Modules** (sem frameworks visuais)
- **100% Client-side** (sem backend de jogo)

## 📄 Licença

MIT
# pizzapp-wordsearch-foundation
