# Vending Machine - Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)

A frontend application for a vending machine system built with Next.js and TypeScript. This application delivers an intuitive, interactive user experience simulating the use of a real vending machine.

## Overview

This frontend serves as the customer interface for the vending machine system, enabling users to:

* Insert money using Moroccan Dirham denominations
* Browse and select products from a dynamic product grid
* Monitor real-time balance and transaction details
* Complete purchases and receive digital receipts
* Cancel transactions and retrieve inserted money

## Features

### Core Functionality

* **Money Management:** Supports MAD 0.5, 1, 2, 5, and 10 denominations
* **Product Selection:** Interactive product grid with real-time stock status
* **Transaction Processing:** Full transaction lifecycle from money insertion to product dispensing
* **Balance Tracking:** Dynamic calculation of remaining balance after product selections
* **Receipt Generation:** Digital receipts summarizing purchases and change returned

### User Experience

* **Authentic Design:** Realistic vending machine look and feel for immersive interaction

### Technical Highlights

* **Backend Integration:** RESTful API communication for all operations
* **State Management:** Robust handling of complex transaction flows using React state
* **Type Safety:** Developed entirely with TypeScript for enhanced reliability and maintainability

## Technology Stack

* **Framework:** Next.js 15.3.3
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Package Manager:** npm

## Screenshots

### Initial State — No Money Inserted

![No Money Inserted](screenshots/no_money_inserted.png)
Products are visible but disabled, prompting the user to insert money to start.

### Money Inserted — Products Available

![Products Can Be Bought](screenshots/can_be_bought.png)
Products become interactive based on inserted money. Green borders indicate affordable items; orange borders show items requiring more funds.

### Product Selection

![Product Selection](screenshots/select_product.png)
Selected products are highlighted with yellow borders and checkmarks. The transaction panel displays current balance, selected items, and total cost.

### Transaction Receipt

![Receipt](screenshots/receipt.png) ![Receipt Details](screenshots/receipt2.png)
Digital receipt shown after successful purchase, detailing items bought, payment summary, and change returned.

## Usage

### Development

Run the development server:

```bash
npm run dev
```

Access the app at `http://localhost:3000`.

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage report:

```bash
npm run test:coverage
```

## API Integration

The frontend communicates with the backend API to perform all operations:

* `GET /api/products` — Retrieve available products
* `POST /api/transaction/money` — Insert money
* `GET /api/transaction/money` — Get inserted money total
* `POST /api/transaction/products/select/{id}` — Select a product
* `GET /api/transaction/products/selected` — Get selected products
* `POST /api/transaction/products/unselect/{id}` — Unselect a product
* `POST /api/transaction/complete` — Complete the transaction
* `POST /api/transaction/cancel` — Cancel the transaction

## Configuration

### Supported Currencies

Supports Moroccan Dirham (MAD) denominations:

* 0.5 MAD
* 1 MAD
* 2 MAD
* 5 MAD
* 10 MAD

## Architecture

### Component Overview

* **VendingMachine:** Main container managing overall application state and logic
* **ProductGrid:** Displays products and handles selection/deselection
* **TransactionPanel:** Manages money insertion, balance display, and transaction controls (confirm, cancel)
* **MoneyInput:** Interface for inserting currency denominations
* **Receipt:** Shows detailed transaction summary after purchase completion

### State Management

The app uses React’s built-in state management to maintain:

* Product inventory and availability status
* Current transaction state including selected products
* Inserted money and remaining balance calculations
* UI loading and error states