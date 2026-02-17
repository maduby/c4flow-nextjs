# C4 Flow Design System - Technical Specifications

This document provides detailed technical specifications extracted from the C4 Flow website for accurate replication in Next.js with Tailwind CSS.

---

## Typography Scale

### Font Sizes
```css
/* Base sizes */
10px
12px
14px
16px (1rem - base)
20px
22px
24px (2rem)
32px
36px
40px

/* Relative sizes */
1.05em
```

### Font Families
```css
--heading-font: 'Mynerve', cursive;
--body-font: 'Montserrat', sans-serif;
```

### Font Weights (Montserrat)
- 400 (Regular)
- 500 (Medium)
- 700 (Bold)

### Tailwind Config Suggestion
```js
fontFamily: {
  heading: ['Mynerve', 'cursive'],
  body: ['Montserrat', 'sans-serif'],
},
fontSize: {
  '10': '10px',
  '12': '12px',
  '14': '14px',
  '16': '16px',
  '20': '20px',
  '22': '22px',
  '24': '24px',
  '32': '32px',
  '36': '36px',
  '40': '40px',
}
```

---

## Border Radius System

### Values Used
```css
2px   - Subtle rounding
3px   - Small elements
4px   - Default small
5px   - Standard buttons/cards
8px   - Medium cards
10px  - Large cards
12px  - Extra large
14px  - Soft corners
16px  - Very soft
20px  - Rounded
50px  - Pill shaped
100px - Full pill
999px/9999px - Perfect circles
```

### Tailwind Config Suggestion
```js
borderRadius: {
  'xs': '2px',
  'sm': '4px',
  'DEFAULT': '8px',
  'md': '10px',
  'lg': '16px',
  'xl': '20px',
  'pill': '50px',
  'full': '9999px',
}
```

---

## Spacing & Layout

### Common Spacing Values
Based on padding/margin patterns:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Tailwind already covers these well with default spacing scale

---

## Color System (Complete Palette)

### CSS Custom Properties Format
```css
:root {
  /* Primary Purple Shades */
  --color-meteorite-dark: #2f1c6a;
  --color-meteorite-darker: #1F1346;
  --color-royal-purple: #5025d1;
  --color-vibrant-purple: #673de6;
  --color-light-purple: #8c85ff;
  --color-soft-purple: #B39EF3;
  --color-very-light-purple: #ebe4ff;
  --color-pale-purple: #d5dfff;
  
  /* Pink Accents */
  --color-deep-pink: #d63163;
  --color-bright-pink: #fc5185;
  --color-light-pink: #FEA8C2;
  --color-pale-pink: #ffe8ef;
  
  /* Orange/Yellow Accents */
  --color-orange: #fea419;
  --color-dark-orange: #9F6000;
  --color-light-orange: #FFD28C;
  --color-yellow: #ffcd35;
  --color-light-yellow: #fff8e2;
  
  /* Teal/Success */
  --color-dark-teal: #008361;
  --color-teal: #00b090;
  --color-light-teal: #def4f0;
  
  /* Neutrals */
  --color-almost-black: #1d1e20;
  --color-dark-gray: #36344d;
  --color-medium-gray: #727586;
  --color-light-gray: #dadce0;
  --color-very-light-gray: #D8DAE0;
  --color-off-white: #f2f3f6;
  --color-black: #000000;
  
  /* Action/Interactive */
  --color-blue: #357df9;
  --color-dark-blue: #265ab2;
  --color-indigo: #6366F1;
  --color-light-blue: #e3ebf9;
}
```

### Tailwind Config
```js
colors: {
  primary: {
    50: '#ebe4ff',
    100: '#d5dfff',
    200: '#B39EF3',
    300: '#8c85ff',
    400: '#673de6',
    500: '#5025d1',
    600: '#2f1c6a',
    700: '#1F1346',
  },
  pink: {
    50: '#ffe8ef',
    200: '#FEA8C2',
    500: '#fc5185',
    600: '#d63163',
  },
  orange: {
    50: '#fff8e2',
    200: '#FFD28C',
    400: '#ffcd35',
    500: '#fea419',
    600: '#9F6000',
  },
  teal: {
    50: '#def4f0',
    500: '#00b090',
    600: '#008361',
  },
  gray: {
    50: '#f2f3f6',
    100: '#D8DAE0',
    200: '#dadce0',
    400: '#727586',
    600: '#36344d',
    800: '#1d1e20',
    900: '#000000',
  },
  action: {
    blue: '#357df9',
    'dark-blue': '#265ab2',
    indigo: '#6366F1',
    'light-blue': '#e3ebf9',
  }
}
```

---

## Transitions & Animations

### Common Transitions
```css
/* Button transitions */
transition: color 0.2s ease, 
            border-color 0.2s ease, 
            background-color 0.2s ease;

/* Background transitions */
transition: background-color 0.3s ease-in-out;

/* Form inputs */
transition: color ease 0.2s;
```

### Animation
```css
/* Gradient animation (hero background likely) */
@keyframes animate-gradient {
  /* 25s duration, ease, infinite */
}
```

### Tailwind Config
```js
transitionDuration: {
  '200': '200ms',
  '300': '300ms',
}
transitionTimingFunction: {
  'ease': 'ease',
  'ease-in-out': 'ease-in-out',
}
```

---

## Box Shadows

The site uses CSS custom properties for button shadows:
```css
--grid-button-primary-box-shadow-x
--grid-button-primary-box-shadow-y
--grid-button-primary-box-shadow-blur
--grid-button-primary-box-shadow-spread
--grid-button-primary-box-shadow-color

/* Common shadow example */
box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
box-shadow: inset 0 0 10vw rgba(219, 219, 211, 0.8);
```

### Tailwind Config
```js
boxShadow: {
  'sm': '0 6px 14px rgba(0, 0, 0, 0.1)',
  'DEFAULT': '0 6px 14px rgba(0, 0, 0, 0.15)',
  'md': '0 6px 14px rgba(0, 0, 0, 0.2)',
  'inner-glow': 'inset 0 0 10vw rgba(219, 219, 211, 0.8)',
}
```

---

## Responsive Breakpoints

### Media Queries Used
```css
/* Mobile first */
@media screen and (max-width: 360px)   /* Extra small phones */
@media screen and (max-width: 500px)   /* Small phones */
@media screen and (max-width: 600px)   /* Phones */
@media screen and (max-width: 920px)   /* Tablets & below */
@media screen and (max-width: 1191px)  /* Small desktop */

/* Ranges */
@media screen and (min-width: 360px) and (max-width: 920px)
@media screen and (min-width: 361px) and (max-width: 920px)
@media screen and (min-width: 601px) and (max-width: 920px)
@media screen and (min-width: 920px) and (max-width: 1224px)

/* Desktop and up */
@media screen and (min-width: 920px)

/* Interaction */
@media (hover: hover)  /* Devices with hover capability */
```

### Key Breakpoint: 920px
**This is the main mobile/desktop breakpoint**

### Tailwind Config
```js
screens: {
  'xs': '360px',
  'sm': '600px',
  'md': '920px',   // Main breakpoint
  'lg': '1224px',
  'xl': '1440px',
  '2xl': '1920px',
}
```

---

## Button Styles

### Primary Button Pattern
```css
.button-primary {
  padding: 12px 24px;
  border-radius: 8px;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 16px;
  background-color: var(--primary-color);
  color: white;
  transition: color 0.2s ease, 
              background-color 0.2s ease, 
              border-color 0.2s ease;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
}

.button-primary:hover {
  background-color: var(--primary-color-hover);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

.button-primary:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

### Secondary Button Pattern
Similar structure with different colors

---

## Form Input Styles

### Input Pattern
```css
.input {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--input-border-color);
  font-family: Montserrat;
  font-size: 16px;
  color: var(--body-color);
  background-color: white;
  transition: color ease 0.2s;
}

.input:hover,
.input:focus {
  color: var(--input-text-color--hover);
  border-color: var(--input-border-color-hover);
}

.input::placeholder {
  font-family: Montserrat;
  color: var(--placeholder-color);
}
```

---

## Card Component Pattern

### Class Card Example
```css
.class-card {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.class-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.class-card-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.class-card-content {
  padding: 24px;
}

.class-card-title {
  font-family: Mynerve;
  font-size: 24px;
  margin-bottom: 8px;
}

.class-card-price {
  font-family: Montserrat;
  font-weight: 700;
  font-size: 20px;
  color: var(--primary-color);
}

.class-card-details {
  font-family: Montserrat;
  font-size: 14px;
  color: var(--medium-gray);
}
```

---

## Icon/Feature Card Pattern

```css
.feature-card {
  text-align: center;
  padding: 32px 24px;
}

.feature-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border-radius: 50%;
  /* May have background color or gradient */
}

.feature-title {
  font-family: Montserrat;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 12px;
}

.feature-description {
  font-family: Montserrat;
  font-size: 16px;
  line-height: 1.6;
  color: var(--body-color);
}
```

---

## WhatsApp Floating Button

```css
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #25D366; /* WhatsApp green */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 920px) {
  .whatsapp-float {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
```

---

## Announcement Bar

```css
.announcement-bar {
  background: linear-gradient(135deg, var(--primary-600), var(--pink-500));
  color: white;
  padding: 12px 24px;
  text-align: center;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 100;
}

@media screen and (max-width: 920px) {
  .announcement-bar {
    font-size: 12px;
    padding: 10px 16px;
  }
}
```

---

## Navigation Header

```css
.header {
  background: white;
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0; /* or top: [announcement-bar-height] */
  z-index: 99;
}

.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 50px;
  width: auto;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-link {
  font-family: Montserrat;
  font-weight: 500;
  font-size: 16px;
  color: var(--dark-gray);
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-500);
}

@media screen and (max-width: 920px) {
  .nav-menu {
    /* Hamburger menu styles */
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
}
```

---

## Hero Section Pattern

```css
.hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg, 
    rgba(47, 28, 106, 0.4) 0%, 
    rgba(31, 19, 70, 0.6) 100%
  );
  z-index: -1;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 40px 24px;
}

.hero-title {
  font-family: Mynerve;
  font-size: 64px;
  margin-bottom: 16px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-family: Montserrat;
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 8px;
}

.hero-tagline {
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 300;
}

@media screen and (max-width: 920px) {
  .hero {
    min-height: 60vh;
  }
  
  .hero-title {
    font-size: 40px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .hero-tagline {
    font-size: 16px;
  }
}
```

---

## Section Spacing Pattern

```css
.section {
  padding: 80px 24px;
}

.section-container {
  max-width: 1440px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-family: Mynerve;
  font-size: 40px;
  color: var(--primary-600);
  margin-bottom: 16px;
}

.section-subtitle {
  font-family: Montserrat;
  font-size: 18px;
  color: var(--medium-gray);
  max-width: 600px;
  margin: 0 auto;
}

@media screen and (max-width: 920px) {
  .section {
    padding: 48px 16px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .section-subtitle {
    font-size: 16px;
  }
}
```

---

## Footer Pattern

```css
.footer {
  background-color: var(--dark-gray);
  color: white;
  padding: 64px 24px 32px;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 48px;
  margin-bottom: 48px;
}

.footer-section-title {
  font-family: Montserrat;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 16px;
}

.footer-link {
  font-family: Montserrat;
  font-size: 14px;
  color: var(--light-gray);
  transition: color 0.2s ease;
  display: block;
  margin-bottom: 8px;
}

.footer-link:hover {
  color: var(--primary-300);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--light-gray);
}

@media screen and (max-width: 920px) {
  .footer {
    padding: 48px 16px 24px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
```

---

## Grid Layouts

### 4-Column Feature Grid
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

@media screen and (max-width: 1191px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 600px) {
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

### Class Cards Grid
```css
.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}

@media screen and (max-width: 920px) {
  .class-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

---

## Implementation Notes for Next.js

### 1. Use Next.js Image Component
```jsx
import Image from 'next/image'

<Image
  src="/hero-background.jpg"
  alt="Studio hero"
  fill
  className="object-cover"
  priority
/>
```

### 2. Font Loading (next/font)
```js
import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
})

// Mynerve might need to be loaded separately
```

### 3. Tailwind CSS Config
Combine all the above configurations into your `tailwind.config.js`

### 4. Component Structure
```
components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AnnouncementBar.tsx
│   └── WhatsAppButton.tsx
├── sections/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Classes.tsx
│   └── Instructor.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Form.tsx
└── shared/
    └── Container.tsx
```

### 5. Animation Library
Consider using:
- Framer Motion for advanced animations
- Tailwind's built-in transitions for simple effects

---

## CSS File Size
**Original:** 321.35 KB  
**Target with Tailwind:** Much smaller with tree-shaking and PurgeCSS

---

This technical specification should provide everything needed to accurately replicate the C4 Flow design system in a modern Next.js + Tailwind CSS application.
