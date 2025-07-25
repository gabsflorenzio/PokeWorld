# Poké World - Pokédex Responsiva

Poké World é uma Pokédex moderna e responsiva que combina tecnologia de ponta com uma experiência de usuário envolvente. Inspirado em um hobby de infância com o clássico anime Pokémon e nos conceitos aprendidos no início da faculdade, este projeto front-end foi desenvolvido para aplicar habilidades em desenvolvimento web, unindo paixão e aprendizado em uma interface interativa.

## ✨ Funcionalidades

- **Exploração de Pokémon**: Consulte dados detalhados de Pokémon (espécies, estatísticas, habilidades, cries, formas regionais e mega evoluções) via PokeAPI.
- **Sistema de Temas Dinâmico**: Escolha entre 8 temas visuais (claros e escuros) com alternância em tempo real, utilizando variáveis CSS (HSL) e React Context API (`useTheme`).
- **Gerenciamento de Times**: Crie e gerencie times de Pokémon com IDs únicos gerados por `uuid`, salvos no `localStorage`.
- **Favoritos**: Marque Pokémon como favoritos com animações interativas e persista as escolhas localmente.
- **Design Responsivo**: Experiência otimizada para mobile, tablet e desktop com abordagem mobile-first.
- **Animações**: Microinterações suaves (ex.: pulsação do botão de cry) usando `tailwindcss-animate` e keyframes CSS.
- **Integração de Áudio**: Reprodução de cries de Pokémon via `useAudioPlayer` context.

## 🛠 Tecnologias Utilizadas

### Frameworks & Linguagens

- **Next.js (App Router)**: Framework React full-stack para roteamento e renderização otimizada com Server Components.
- **React**: Biblioteca principal para interfaces reativas e componentes reutilizáveis.
- **TypeScript**: Tipagem estática para robustez e manutenibilidade.
- **CSS & HTML**: Estilização com Tailwind CSS e estrutura em JSX.

### Gerenciamento de Estado & UI

- **React Hooks**: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef` para lógica e otimização.
- **React Context API**: Contextos customizados (`useTheme`, `useFavorites`, `useTeams`, `useAudioPlayer`) para estado global.
- **shadcn/ui**: Componentes UI acessíveis baseados em Tailwind CSS e Radix UI.
- **Lucide React**: Ícones vetoriais leves e personalizáveis.

### Dados & Integrações

- **PokeAPI**: API REST para dados detalhados de Pokémon.
- **fetch API**: Requisições HTTP nativas.
- **localStorage**: Persistência de temas, favoritos e times.
- **uuid**: Geração de IDs únicos para times.

### Estilização & Design

- **Tailwind CSS**: Framework utility-first para estilização rápida e responsiva.
- **Sistema de Temas**: 8 temas dinâmicos com variáveis CSS (HSL) e Context API.
- **Design Responsivo**: Classes Tailwind para suporte a múltiplos dispositivos.
- **Animações**: Efeitos visuais com `tailwindcss-animate` e keyframes CSS.

## 🚀 Como Executar o Projeto

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/poke-world.git
   cd poke-world
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

4. Acesse o projeto em `http://localhost:3000`.

## 📦 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Conexão com a internet para consumir a PokeAPI

## 🌟 Inspiração

Revisitando os conceitos aprendidos no início da faculdade, decidi unir meu amor pelo desenvolvimento front-end com um hobby de infância: o universo Pokémon. O Poké World é o resultado dessa paixão, aplicando tecnologias modernas para criar uma experiência interativa e nostálgica.

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests com melhorias, correções ou novas funcionalidades.

## 📬 Contato

Quer discutir o projeto ou colaborar? Conecte-se comigo no [LinkedIn](https://www.linkedin.com/in/gabrielflorenciorpa) ou abra uma issue no repositório!

---

#PokéWorld #WebDev #NextJS #React #TypeScript #Pokémon
