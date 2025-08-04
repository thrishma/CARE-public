# CARE - Composable Architecture Recommendation Engine

A web application that helps design composable e-commerce architectures following MACH principles through an AI-powered conversational interface.

## Features

- **Conversational AI Interface**: Chat with CARE to describe your business needs
- **MACH-Compliant Recommendations**: Only suggests vendors that follow MACH principles
- **Comprehensive Vendor Database**: 43+ MACH-compliant vendors across all categories
- **Interactive Flow Diagrams**: SVG-based diagrams showing checkout flows and data connections
- **Dual Diagram Views**: Flow diagram and component view for different perspectives
- **Architecture Export**: Generate JSON architecture summaries
- **Smart Conditional Arrows**: Only shows data flows for selected services
- **Vendor Logo Integration**: Visual representation of selected vendors
- **Real-time Validation**: Ensures all recommendations follow MACH principles

## MACH Principles

- **Microservices-based**: Avoid monolithic architectures
- **API-first**: Integrations driven by APIs
- **Cloud-native SaaS**: No on-premise dependencies
- **Headless**: Decoupled frontend/backend with interchangeable layers

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Chakra UI
- **Backend**: Next.js API Routes, Node.js
- **AI**: OpenAI GPT-4o
- **Diagrams**: Custom SVG-based interactive diagrams
- **Icons**: React Icons
- **Data**: JSON flat files (vendor knowledge)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd care
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Start a Conversation**: Describe your business and e-commerce needs
2. **Answer Questions**: CARE will ask follow-up questions to understand your requirements
3. **Get Recommendations**: Receive MACH-compliant vendor suggestions with explanations
4. **View Architecture**: Switch to the Architecture tab to see visual diagrams
5. **Choose Diagram Type**: Toggle between Flow Diagram and Component View
6. **Interact with Diagrams**: Hover over components to see vendor details
7. **Export Results**: Download your architecture as JSON

### Diagram Features

- **Flow Diagram**: Shows e-commerce checkout process with data flows
  - Horizontal flow: User → Frontend → Commerce → Checkout → Payment
  - Conditional arrows: Only shows connections for selected services
  - Interactive hover: View vendor details and connections
  
- **Component View**: Layered architecture overview
  - MACH principle validation
  - Vendor breakdown by category
  - Step-by-step checkout flow explanation

### Example Conversation

```
User: "I want an ecommerce platform for Mackage using NewStore as omnichannel."

CARE: "Great! I see you're planning to use NewStore for omnichannel operations. 
Let me ask a few questions to complete your architecture:

1. Do you have a preferred commerce engine?
2. What PIM system are you considering?
3. Any specific CMS requirements?"
```

## API Endpoints

### `/api/vendors`
- **GET**: Returns all vendors grouped by category
- **POST**: Filter vendors by category and MACH compliance

### `/api/conversation`
- **POST**: Process conversation messages and return AI responses

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── vendors/
│   │   └── conversation/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── diagram/
│   │   ├── FlowArchitectureDiagram.tsx
│   │   └── SimpleArchitectureDiagram.tsx
│   └── ui/
│       └── VendorLogo.tsx
├── data/
│   └── vendors.json
├── types/
│   ├── vendor.ts
│   └── conversation.ts
└── README.md
```

## Vendor Categories

CARE includes 43+ MACH-compliant vendors across these categories:

- **Commerce Engines**: commercetools, Elastic Path, VTEX, Shopify Plus, BigCommerce Enterprise
- **PIM**: Akeneo, Salsify, Syndigo, Plytix, inRiver
- **CMS**: Contentstack, Contentful, Storyblok, Sanity, Strapi
- **Search**: Algolia, Elasticsearch, Swiftype, Constructor, Lucidworks
- **Payment**: Adyen, Stripe, PayPal, Klarna, Affirm
- **Omnichannel**: NewStore, Tulip Retail, Aptos, Manhattan Associates
- **Analytics**: Segment, Amplitude, Mixpanel, Adobe Analytics
- **Personalization**: Dynamic Yield, Optimizely, Monetate, Yotpo
- **Loyalty**: Yotpo, LoyaltyLion, Smile.io, Antavo
- **Tax**: Avalara, TaxJar, Vertex
- **Inventory**: TradeGecko, Cin7, Brightpearl
- **Order Management**: Fluent Commerce, Manhattan OMS, IBM Sterling

## Development

### Adding New Vendors

1. Edit `data/vendors.json`
2. Add vendor information following the schema in `types/vendor.ts`
3. Ensure `machCompliant` is set correctly

### Customizing the AI Prompt

Edit the `SYSTEM_PROMPT` in `app/api/conversation/route.ts` to modify CARE's behavior and knowledge.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.