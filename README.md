# React + TypeScript + Vite

This project is a template that provides a minimal setup to get React working with TypeScript and Vite. It includes Hot Module Replacement (HMR) and some ESLint rules to ensure code quality.

## Features

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.

## Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for Fast Refresh.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```sh
npm install
# or
yarn install
```

### Running the Development Server

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:3000`. You should see your React app running.

### Building for Production

To create a production build:

```sh
npm run build
# or
yarn build
```

The output will be in the `dist` directory.

## Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

1. Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

2. Replace `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`.
3. Optionally add `...tseslint.configs.stylisticTypeChecked`.
4. Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Project Structure

The project structure is as follows:

```
├── public
│   └── index.html
├── src
│   ├── components
│   ├── pages
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── .eslintrc.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

- **public**: Contains the static assets.
- **src**: Contains the source code.
  - **components**: Contains the reusable UI components.
  - **pages**: Contains the page components.
  - **App.tsx**: The root component.
  - **main.tsx**: The entry point of the application.
- **.eslintrc.js**: ESLint configuration file.
- **tsconfig.json**: TypeScript configuration file.
- **vite.config.ts**: Vite configuration file.
- **package.json**: Contains the project dependencies and scripts.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)

<!-- ## Contact -->

<!-- For any questions or feedback, please contact [your-email@example.com](mailto:your-email@example.com). -->
