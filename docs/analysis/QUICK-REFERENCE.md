# C4 Flow Website Analysis - Quick Reference

**Analysis Date:** February 17, 2026  
**Website:** https://c4flow.co.za  
**Documentation Created:** Complete site analysis with 4 comprehensive documents

---

## 📁 Documentation Files

1. **WEBSITE-ANALYSIS.md** - Complete content analysis, SEO, and site structure
2. **DESIGN-SYSTEM.md** - Technical design specifications (CSS, colors, typography, breakpoints)
3. **CONTENT-STRUCTURE.md** - Component specs and CMS schema recommendations
4. **THIS FILE** - Quick reference and implementation roadmap

---

## 🎨 Quick Design Reference

### Colors (Primary Palette)
```
Purple: #2f1c6a, #5025d1, #673de6, #8c85ff
Pink: #d63163, #fc5185, #FEA8C2
Orange: #fea419, #ffcd35
Teal: #008361, #00b090
Neutrals: #1d1e20, #727586, #f2f3f6
```

### Typography
```
Headings: 'Mynerve' (Google Fonts)
Body: 'Montserrat' (weights: 400, 500, 700)
```

### Key Measurements
```
Main breakpoint: 920px
Button padding: 12px 24px
Border radius: 8px (standard), 16px (cards)
Section padding: 80px vertical (desktop)
Shadow: 0 6px 14px rgba(0,0,0,0.1)
```

---

## 📄 Site Structure

```
c4flow.co.za/
├── / (Homepage)
│   ├── Announcement Bar (sale notification)
│   ├── Hero Section
│   ├── Features (4 icons)
│   ├── Classes Preview (3 cards)
│   └── Instructor Preview
│
├── /about
│   ├── Mission Statement
│   ├── About Studio
│   ├── Full Instructor Bio (Cattleya)
│   ├── Studio Gallery
│   └── Instagram Feed
│
├── /classes
│   ├── Classes Intro
│   ├── Group Classes (4 classes)
│   │   ├── Exotic Baddies (R200, Mon & Fri)
│   │   ├── Dynamic Static (R200, Tues)
│   │   ├── Spinning Goddess (R200, Mon/Tues/Thurs)
│   │   └── Heels & Queens (R200, Sat)
│   └── Private Classes Info
│
└── /contact
    ├── Contact Info Cards
    ├── Contact Form
    ├── Google Maps
    └── Social Links
```

---

## 🔗 External Integrations

### Setmore (Booking)
- **URL:** movetoexpresswithc4flow.setmore.com
- **Staff ID:** 7872380e-7a3b-437c-bf6b-a3706e428023
- **Integration:** Direct booking links per class

### WhatsApp
- **Number:** +27 65 391 7901
- **Pre-filled:** "Hey, I'm interested in booking a class with you!"
- **Position:** Floating button, bottom-right

### Google Maps
- **Location:** Woodstock Exchange, 66 Albert Road
- **Coordinates:** -33.926702, 18.4434095

### Instagram
- **Studio:** @c_4_flow
- **Instructor:** @cattleya_mystic_muse

### Email
- **Contact:** info@c4flow.co.za

---

## 🏗️ Implementation Roadmap

### Phase 1: Setup & Foundation
- [ ] Initialize Next.js project (App Router)
- [ ] Setup Tailwind CSS with custom config
- [ ] Configure fonts (next/font)
- [ ] Setup Sanity Studio
- [ ] Create base schemas

### Phase 2: Core Components
- [ ] Layout components (Header, Footer)
- [ ] Announcement Bar
- [ ] WhatsApp floating button
- [ ] Button components
- [ ] Card components
- [ ] Form components

### Phase 3: Homepage
- [ ] Hero section
- [ ] Features section (4 icons)
- [ ] Classes preview
- [ ] Instructor preview
- [ ] Connect to Sanity

### Phase 4: About Page
- [ ] Mission section
- [ ] About studio content
- [ ] Instructor bio (full)
- [ ] Studio gallery
- [ ] Instagram integration

### Phase 5: Classes Page
- [ ] Classes intro
- [ ] Class cards (4 classes)
- [ ] Setmore integration
- [ ] Private classes section
- [ ] Dynamic content from Sanity

### Phase 6: Contact Page
- [ ] Contact info cards
- [ ] Contact form (with email)
- [ ] Google Maps embed
- [ ] Form submission handling

### Phase 7: Polish & Deploy
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit
- [ ] Deploy to Hostinger

---

## 🎯 Key Business Information

### Studio Details
- **Name:** C4 Flow Studio
- **Location:** Woodstock Exchange, Cape Town
- **Address:** 66 Albert Road, Woodstock, Western Cape 8001
- **Contact:** info@c4flow.co.za | +27 65 391 7901

### Instructor
- **Name:** Cattleya
- **Title:** Lead Instructor & Studio Director
- **Experience:** 10+ years performance, 4 years teaching
- **Instagram:** @cattleya_mystic_muse

### Classes
1. **Exotic Baddies** - R200 | 60 min | Mon & Fri
2. **Dynamic Static** - R200 | 60 min | Tuesday
3. **Spinning Goddess** - R200 | 60 min | Mon, Tues & Thurs
4. **Heels & Queens** - R200 | 60 min | Saturday

### Current Promotion
**25% OFF ALL GROUP CLASSES & PACKAGES**  
Valid until: End of March 2026

### Operating Hours
By appointment only | Sunday: Closed

---

## 📋 Content Checklist

### Required Images
- [ ] Logo (transparent PNG)
- [ ] Hero background (1920px+ width)
- [ ] 4 feature icons (Strength, Balance, Flexibility, Flow)
- [ ] Class photos (4 classes)
- [ ] Instructor photo (professional)
- [ ] Studio space gallery (6-12 images)
- [ ] Favicon (16x16, 32x32, 192x192)
- [ ] Open Graph image (1440x756)

### Required Content
- [ ] Mission statement
- [ ] About studio text (3 paragraphs)
- [ ] Instructor bio (full version)
- [ ] Class descriptions (4 classes)
- [ ] Contact information
- [ ] FAQ/Class details (optional)

### SEO Content
- [ ] Page titles (4 pages)
- [ ] Meta descriptions (4 pages)
- [ ] Keywords
- [ ] Alt text for all images
- [ ] Structured data (Schema.org)

---

## 🛠️ Technology Stack Recommendations

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3.4+
- **Fonts:** next/font/google
- **Images:** next/image
- **Animations:** Framer Motion (optional)

### CMS
- **Platform:** Sanity Studio
- **Integration:** @sanity/client
- **Visual Editing:** @sanity/visual-editing

### Forms & Email
- **Email Service:** Resend or SendGrid
- **Validation:** React Hook Form + Zod
- **Spam Protection:** Google reCAPTCHA v3

### Deployment
- **Hosting:** Hostinger (as per original)
- **Alternative:** Vercel (recommended for Next.js)
- **CDN:** Built-in (Hostinger) or Cloudflare

### Analytics
- **Platform:** Google Analytics 4
- **Alternative:** Vercel Analytics

---

## 🎨 Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['Mynerve', 'cursive'],
        body: ['Montserrat', 'sans-serif'],
      },
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
        // ... (see DESIGN-SYSTEM.md for full config)
      },
      screens: {
        'md': '920px', // Main breakpoint
      },
      boxShadow: {
        'card': '0 6px 14px rgba(0, 0, 0, 0.1)',
      },
    },
  },
}
```

---

## 📱 Responsive Considerations

### Mobile (< 920px)
- Hamburger menu
- Stacked sections
- 1-column grids
- Smaller font sizes
- Reduced padding
- Simplified navigation

### Tablet (920px - 1224px)
- 2-column grids
- Moderate padding
- Readable font sizes

### Desktop (> 1224px)
- 3-4 column grids
- Full navigation
- Optimal spacing
- Larger imagery

---

## ✅ Quality Checklist

### Performance
- [ ] Images optimized (WebP/AVIF)
- [ ] Lazy loading implemented
- [ ] Code splitting used
- [ ] Fonts optimized
- [ ] CSS minified
- [ ] Lighthouse score > 90

### SEO
- [ ] Meta tags on all pages
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs

### Accessibility
- [ ] Semantic HTML
- [ ] Alt text on images
- [ ] Keyboard navigation
- [ ] ARIA labels where needed
- [ ] Color contrast (WCAG AA)
- [ ] Focus states visible
- [ ] Screen reader tested

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (desktop)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

### Functionality
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Booking integration works
- [ ] WhatsApp button opens correctly
- [ ] Map loads properly
- [ ] Instagram feed displays

---

## 📞 Contact & Support

### Client Information
- **Business:** C4 Flow Studio
- **Email:** info@c4flow.co.za
- **Phone:** +27 65 391 7901
- **Location:** Woodstock, Cape Town

### Development Notes
- Original site built with Hostinger Website Builder
- Assets hosted on zyrosite.com CDN
- Booking platform: Setmore
- Current promotion: 25% off until March 2026

---

## 🚀 Quick Start Commands

```bash
# Create Next.js app
npx create-next-app@latest c4flow-nextjs --typescript --tailwind --app

# Install dependencies
npm install @sanity/client @sanity/image-url next-sanity
npm install react-hook-form zod
npm install framer-motion

# Initialize Sanity Studio
npm create sanity@latest -- --project c4flow --dataset production

# Development
npm run dev

# Build
npm run build
```

---

## 📝 Notes & Observations

### Current Site Characteristics
- **Platform:** Hostinger Website Builder (Astro-based)
- **File Size:** ~300KB HTML (minified)
- **CSS Size:** ~321KB
- **Load Time:** Good (CDN optimized)
- **Mobile Friendly:** Yes
- **SEO Optimized:** Yes (good meta tags)

### Design Philosophy
- Clean, modern aesthetic
- Purple/pink gradient scheme
- Focus on empowerment and inclusivity
- Professional yet approachable
- Image-heavy (studio showcase)

### Target Audience
- All genders and body types
- Beginners to advanced
- Ages 18-50+
- Cape Town locals
- People seeking confidence through movement

### Brand Values
- Inclusivity
- Empowerment
- Self-expression
- Community
- Body autonomy

---

## 🔄 Maintenance & Updates

### Regular Updates Needed
- Class schedules
- Pricing (sales/promotions)
- Instructor information
- Studio photos
- Instagram feed
- Announcement bar messages

### Seasonal Updates
- Promotional campaigns
- Holiday schedules
- Special events
- Workshops

### Content Strategy
- Blog posts (future consideration)
- Student testimonials
- Class highlight videos
- Behind-the-scenes content
- Movement tips and tutorials

---

## 📊 Analytics to Track

### Key Metrics
- Page views per page
- Bounce rate
- Time on site
- Booking conversions
- Contact form submissions
- WhatsApp clicks
- Social media clicks

### Goal Tracking
- Class bookings (Setmore)
- Contact form completions
- Phone/WhatsApp contacts
- Instagram profile visits

---

## ✨ Future Enhancement Ideas

### Phase 2 Features
- Online class packages purchase
- Member portal/login
- Class schedule calendar
- Video testimonials
- Blog/resources section
- Newsletter signup
- Gift certificates

### Advanced Features
- Online streaming classes
- Progress tracking for students
- Achievement badges
- Community forum
- Event registration
- Merchandise shop

---

## 🎓 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [Setmore API Docs](https://developer.setmore.com/)

### Inspiration
- Original site: https://c4flow.co.za
- Similar studios (for reference)
- Pole dance community sites

---

**End of Quick Reference**

For detailed specifications, refer to:
- WEBSITE-ANALYSIS.md
- DESIGN-SYSTEM.md
- CONTENT-STRUCTURE.md
