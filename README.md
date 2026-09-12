# QRFlow

QRFlow is a browser-based QR code generator for creating and exporting codes for URLs, text, Wi-Fi networks, contacts, email, phone numbers, SMS messages, and map locations.

The app is built with Next.js and keeps QR generation in the browser. No application database or server-side content storage is required.

## Features

- Generate QR codes for eight content types:
  - URL
  - Plain text
  - Wi-Fi
  - Contact
  - Email
  - Phone
  - SMS
  - Location
- Customize foreground and background colors
- Choose square, rounded, or dot patterns
- Adjust size and error-correction level
- Use transparent backgrounds
- Export codes as PNG, JPG, or SVG
- Copy the generated QR image to the clipboard
- Responsive layout with light and dark themes

## Requirements

- Node.js 18.18 or newer
- pnpm 12 or another package manager that can install the project dependencies

The repository declares pnpm 12.3.4 as its package manager. Using pnpm is recommended for matching the lockfile exactly.

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd qrflow
```

Replace `<repository-url>` with the URL of your Git repository. If the folder created by Git has a different name, change into that folder instead.

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The development server supports hot reloading, so changes to the application are reflected automatically.

## Production build

Create and run an optimized production build with:

```bash
pnpm build
pnpm start
```

The `start` command must be run after `build` has completed successfully.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the Next.js development server |
| `pnpm build` | Creates an optimized production build |
| `pnpm start` | Runs the production build |

## Environment variables

QRFlow does not require any environment variables for local development or its core QR generation features.

## Project structure

```text
app/
├── globals.css       # Global styles and theme variables
├── layout.tsx        # Root layout, metadata, viewport, and analytics
└── page.tsx          # QRFlow interface and client-side QR generation

components/
└── ui/               # Shared UI components

lib/
└── utils.ts          # Shared utility helpers

public/               # Static icons and other public assets
```

## Technology

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [qrcode.react](https://github.com/zpao/qrcode.react) for QR rendering
- [Framer Motion](https://motion.dev/) for interface animation
- [Lucide React](https://lucide.dev/) for icons
- [Vercel Analytics](https://vercel.com/analytics) in production

## How QRFlow handles data

QRFlow builds the QR payload in the browser and renders the result locally. The project does not include a database, authentication system, or API route for storing generated content.

When using the hosted version, the site may load Vercel Analytics in production. The generated QR content itself is not sent to an application database by QRFlow.

## Browser permissions

The copy action uses the Clipboard API. Browsers may require the page to be served over HTTPS and may ask for permission before allowing clipboard access. Downloading files does not require an account.

## Deployment

QRFlow can be deployed as a standard Next.js application. Vercel is the simplest deployment option:

1. Import the repository into Vercel.
2. Keep the detected framework as Next.js.
3. Use `pnpm install` for the install command if Vercel does not detect it automatically.
4. Deploy the project.

For another hosting provider, use the provider's documented Next.js deployment process. QRFlow uses the standard `next build` and `next start` workflow and does not require a separate database service.

## Contributing

1. Fork the repository.
2. Create a branch for your change:
   ```bash
   git checkout -b feature/your-change
   ```
3. Install dependencies with `pnpm install`.
4. Run the app locally with `pnpm dev`.
5. Make and test your changes.
6. Commit the change and open a pull request.

Please keep changes focused and preserve the existing accessible, responsive interface patterns.

## License

No license file is currently included in the repository. Add a `LICENSE` file before distributing the project under a specific open-source license.

## Support

For bugs or feature requests, open an issue in the project's Git repository and include:

- A clear description of the problem
- Steps to reproduce it
- Your browser and operating system
- Relevant screenshots or error messages

## Maintainer notes

The project currently has no automated test or lint script in `package.json`. Before opening a pull request, run at least:

```bash
pnpm build
```

This verifies that the application can be compiled for production.

---

QRFlow — create, customize, and share QR codes directly from your browser.
