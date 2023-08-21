# WizardGarden - Readme

## Project Overview

WizardGarden is a local multiplayer game created as a part of a learning journey with React, Next.js, and Tailwind CSS. The project is based on the board game "Wizard’s Garden," designed by Tim Schutz. The goal of the game is for two players to compete against each other to plant, cultivate, and grow magical flowers in a shared garden. The players aim to align four seeds of the same color either vertically, horizontally, or diagonally to make a flower and earn victory points. If a flower is of the favorable color, the player gains control of the coveted "Tomo del Mago," a magical book that aids in tiebreakers.

## Technologies Used

- **React:** Used for building the user interface and handling game interactions.
- **Next.js:** Employed for server-side rendering and routing.
- **Tailwind CSS:** Utilized for styling and layout of the game components.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To get started with the development server, run the following command:

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000/) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on <http://localhost:3000/api/hello>. This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

Learn More
----------

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

Game Information
----------------

-   Title: Wizard's Garden
-   Author: Tim Schutz
-   Players: 2
-   Duration: Approximately 45 minutes
-   Published Year: 2004 (reprinted in 2019)
-   Mechanics: Abstract, tile placement, pattern building
-   Language Dependency: No text in the game

Gameplay Rules
--------------

Players take turns to place seeds (tiles) on the game board. The seeds need to be placed in an empty cell that is adjacent orthogonally to at least one other previously placed seed. The seeds adjacent to the newly placed seed are rotated to the opposite side. When a player aligns four seeds of the same color either vertically, horizontally, or diagonally, they create a flower (earning a victory point). If the flower matches the color of the "Tomo del Mago" and the player doesn't already have it, they gain control of it.

The game ends either when the common seed pool is exhausted or when no more seeds can be placed on the game board. The player with the most points wins. In case of a tie, the player with control of the "Tomo del Mago" wins.

Acknowledgments
---------------

The design and inspiration for this project come from the original board game "Wizard's Garden" by Tim Schutz. The project was developed as an educational exercise to learn React, Next.js, and Tailwind CSS.

Future Enhancements
-------------------

While this project serves as a learning experience, there are potential future enhancements that can be considered:

-   Improved UI/UX: Enhance the user interface design and overall user experience.
-   Online Multiplayer: Implement online multiplayer functionality to allow players to compete remotely.
-   Gameplay Variations: Add additional gameplay modes, variations, or rule sets to increase replayability.

Credits
-------

This project was created by Gabriele Partiti. Special thanks to Tim Schutz for designing the original board game "Wizard's Garden."
