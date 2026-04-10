# Techaus Landing Page

A modern, responsive landing page for Techaus insurance company built with **Next.js 15**, **React 19**, **Radix UI**, and **Tailwind CSS**.

## Features

- ✨ Modern, responsive design that matches the original Techaus landing page
- 🎨 Built with Radix UI components and Tailwind CSS
- 📱 Mobile-first approach with adaptive layouts
- 🚀 Next.js App Router for optimal performance
- 🎯 Semantic HTML with proper accessibility
- 💨 Icons from Lucide React
- 🖼️ Optimized images with Next.js Image component

## Project Structure

```text
techaus-landing/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global Tailwind styles
├── components/
│   ├── Navigation.tsx      # Header navigation with mobile menu
│   ├── Hero.tsx            # Hero section with CTA
│   ├── Partners.tsx        # Partners/Trust strip
│   ├── Services.tsx        # Services grid (4 cards)
│   ├── WhyChoose.tsx       # Why Choose Us section
│   ├── CTA.tsx             # Call-to-action section
│   └── Footer.tsx          # Footer with company info
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd techaus-landing
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the Project

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will auto-update as you edit files.

### Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **Lucide React** - Icon library

## Sections Included

1. **Navigation** - Fixed header with logo, menu items, and mobile hamburger
2. **Hero Section** - Large banner with background image, headline, and CTAs
3. **Partners Strip** - Logo showcase of partner companies
4. **Services Grid** - 4-column grid showcasing insurance service offerings
5. **Why Choose Us** - Section with team image and feature list
6. **Call to Action** - Promotional section with contact options
7. **Footer** - Multi-column footer with links, contact info, and social media

## Customization

### Colors

Edit the Tailwind theme in `tailwind.config.ts` to customize colors:

```typescript
colors: {
  techaus: {
    primary: '#1e293b',
    accent: '#0ea5e9',
    light: '#f8fafc',
    dark: '#0f172a'
  }
}
```

### Fonts

Fonts are imported in `app/layout.tsx` and set as CSS variables:
- **Heading Font**: Montserrat
- **Body Font**: Open Sans

### Images

Remote images are configured in `next.config.js`. All images come from Unsplash and can be replaced.

## Next Steps

- Replace placeholder images with real branding assets
- Update contact information in the footer
- Connect buttons to actual functionality
- Add form validation for contact forms
- Set up analytics
- Deploy to Vercel or your preferred platform

## License

This project is open source and available under the MIT License.
