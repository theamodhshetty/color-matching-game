# Color Matching Game

A fast-paced mini game built on MiniKit where players must tap tiles matching a target color before time runs out.

## Game Features

- **Gameplay**: Match the colored tiles to the target color displayed at the top
- **Scoring**: +10 points for correct matches, -5 points for incorrect matches
- **Timer**: 30-second countdown for each game session
- **Blockchain Integration**: Scores saved on-chain via Base, a Layer 2 Ethereum blockchain
- **Personal Bests**: Track your highest scores linked to your wallet address

## Built With

- [Next.js](https://nextjs.org) - React framework
- [MiniKit](https://base.org/builders/minikit) - SDK for building Mini Apps on Base
- [OnchainKit](https://onchainkit.xyz) - Tools for blockchain integration
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Update your `.env` file with your own settings:

- NEXT_PUBLIC_ONCHAINKIT_API_KEY - Your Coinbase Developer API key
- NEXT_PUBLIC_URL - Your app's URL

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## How to Play

1. Connect your wallet using the button in the top-right corner
2. Press "Start Game" to begin
3. Match tiles with the target color shown at the top
4. Try to score as many points as possible before the timer runs out
5. Save your score on-chain when the game ends

## Learn More

- [MiniKit Documentation](https://base.org/builders/minikit) - Learn about MiniKit's features
- [OnchainKit Documentation](https://onchainkit.xyz/getting-started) - Explore blockchain integration
- [Base Documentation](https://docs.base.org) - Learn about the Base ecosystem
