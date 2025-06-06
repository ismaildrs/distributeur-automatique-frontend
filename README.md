# Vending Machine Frontend

An authentic vending machine frontend built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Designed to look and feel like a real vending machine with proper transaction workflow.

## Features

- 🎰 **Authentic Vending Machine UI**: Realistic design with retro styling and digital displays
- 💰 **Moroccan Dirham Support**: Accepts 0.5, 1, 2, 5, and 10 MAD denominations
- 🔄 **Proper Transaction Flow**: Insert money first, then select products
- 🥤 **Product Display**: Grid layout with slot labels (A1, A2, etc.) like real machines
- 🛒 **Multi-Product Selection**: Buy multiple items in one transaction
- 🧾 **Digital Receipt**: Complete transaction summary with change calculation
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ♿ **Accessibility**: Built with accessibility best practices
- 🔄 **Real-time Updates**: Live product availability and transaction status
- 🎨 **Retro Aesthetic**: Dark theme with green/yellow displays mimicking classic vending machines

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks (useState, useEffect)
- **API Integration**: Fetch API with custom error handling
- **Development**: ESLint, Hot Reload

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Backend API running on `http://localhost:8080` (or configure `NEXT_PUBLIC_API_BASE_URL`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd distributeur-automatique-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local to set your backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API

This frontend is designed to work with a vending machine backend API with the following endpoints:

- `GET /api/products` - Get all available products
- `POST /api/transactions/{transactionId}/products/{productId}` - Select a product
- `POST /api/transactions/{transactionId}/money` - Insert money
- `POST /api/transactions/{transactionId}/complete` - Complete transaction
- `POST /api/transactions/{transactionId}/cancel` - Cancel transaction

## Usage

### Proper Vending Machine Workflow

1. **Insert Money First**: Use the money slot to insert Moroccan Dirham coins (0.5, 1, 2, 5, 10 MAD)
2. **Browse Products**: View available products in the display window with slot labels (A1, B2, etc.)
3. **Select Items**: Click on products to add them to your transaction (only works after inserting money)
4. **Add More Items**: Continue selecting products or inserting more money as needed
5. **Complete or Cancel**: Use the COMPLETE button when you have sufficient funds, or CANCEL to get your money back
6. **Collect Items**: View your receipt and collect your items and change from the dispensing area

### Key Rules
- **Money must be inserted first** to start a transaction
- **Multiple products** can be selected in one transaction
- **Sufficient funds** must be available before completing the purchase
- **Cancel anytime** to get your money back
- **Change is automatically calculated** and returned

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── VendingMachine.tsx # Main vending machine component
│   ├── ProductGrid.tsx    # Product display grid
│   ├── TransactionPanel.tsx # Transaction management
│   ├── MoneyInput.tsx     # Money insertion interface
│   └── Receipt.tsx        # Receipt display modal
├── lib/                   # Utility libraries
│   └── api.ts            # API service functions
├── types/                 # TypeScript type definitions
│   └── api.ts            # API and application types
└── public/               # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Full type safety with strict mode enabled
- **ESLint**: Code linting with Next.js recommended rules
- **Tailwind CSS**: Utility-first CSS framework for consistent styling

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
