# 💍 BenArt Product Listing App

A React TypeScript product listing application featuring jewelry rings with real-time pricing and interactive features.

## ✨ Features

- **Product Display**: Beautiful grid layout showcasing engagement rings
- **Dynamic Pricing**: Calculated using formula: `(popularityScore + 1) × weight × goldPrice`
- **Color Selection**: Choose between Yellow, Rose, and White gold options
- **Interactive Carousel**: Touch/swipe enabled product carousel
- **Rating System**: Popularity scores converted to 5-star ratings
- **Advanced Filtering**: Filter by price range and popularity rating
- **Virtual Try-On**: AI-powered ring try-on using Google Gemini API
- **Responsive Design**: Optimized for all device sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd benart-main

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Setup

### Required Environment Variables
```bash
# Create .env.local file
cp .env.example .env.local
```

Add your API keys:
```env
# Gemini AI API Key for Virtual Try-On
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys
1. **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/)

## 📦 Deployment

### Netlify Deployment
1. Push your code to GitHub
2. Connect your repo to Netlify
3. Set Environment Variables in Netlify:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
4. Deploy!

**Build Command**: `npm run build`  
**Publish Directory**: `dist`

## 🏗️ Architecture

### Backend (Mock API)
- **Data Source**: `server/data/products.json`
- **API Layer**: `src/services/api.ts`
- **Price Calculation**: Real-time dynamic pricing
- **Filtering**: Server-side filtering by price and rating

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Components**: Modular component architecture
- **State Management**: React Hooks
- **Icons**: Lucide React

### Project Structure
```
benart-main/
├── src/
│   ├── components/          # Reusable UI components
│   ├── services/           # API services
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── server/
│   └── data/
│       └── products.json   # Product data
├── .env.example            # Environment variables template
└── README.md
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **API**: Mock REST API
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Deployment**: Netlify

## 📊 Assignment Requirements Coverage

✅ **Backend: Mock API Development**
- RESTful API structure
- JSON data source with required attributes
- Dynamic price calculation formula

✅ **Real-time Gold Price Integration**
- Price formula implementation
- US Dollar pricing

✅ **Frontend: Product Display**
- Product listing with all information
- Color picker for gold options
- Carousel with touch/swipe support
- 5-star rating system

✅ **Bonus Features**
- Advanced filtering (price range, popularity)
- Responsive design
- Virtual try-on feature

## 🔒 Security

- Environment variables properly configured
- API keys not committed to repository
- Production-ready security practices

## 📄 License

This project is created for educational purposes.

---

🔗 **Live Demo**: https://renartintern.netlify.app/
📧 **Contact**: eyupiliss@gmail.com
