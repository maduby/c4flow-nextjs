# C4 Flow Content Structure & Components

This document outlines the complete content structure and component specifications for replicating the C4 Flow website.

---

## Site-Wide Components

### 1. Announcement Bar Component

**Position:** Fixed top of every page  
**Visibility:** Always visible, sticky at top

**Content:**
```
"SALE! 25% OFF ALL GROUP CLASSES & PACKAGES UNTIL END OF MARCH 2026"
```

**Props/CMS Fields:**
- `message` (string, rich text)
- `isActive` (boolean)
- `backgroundColor` (color)
- `textColor` (color)
- `link` (optional URL)

**Styling:**
- Full width
- Gradient background (purple to pink)
- Center-aligned text
- Responsive font sizing
- Dismissible (optional)

---

### 2. Header/Navigation Component

**Structure:**
```
Logo (left) | Navigation Menu (right)
```

**Logo:**
- C4 Flow transparent logo
- Links to homepage
- Height: ~50px (desktop), ~40px (mobile)

**Navigation Items:**
1. Home (/)
2. About (/about)
3. Classes (/classes)
4. Contact (/contact)

**Mobile Behavior:**
- Hamburger menu at 920px breakpoint
- Slide-in or dropdown mobile menu
- Mobile menu shows same links vertically

**States:**
- Default
- Hover (color change)
- Active (current page indicator)

---

### 3. WhatsApp Floating Button Component

**Position:** Fixed bottom-right  
**Visibility:** All pages except maybe booking pages

**Content:**
- WhatsApp icon (white)
- Phone number: +27 65 391 7901
- Pre-filled message: "Hey, I'm interested in booking a class with you!"

**Styling:**
- 56px circle (desktop), 48px (mobile)
- WhatsApp green (#25D366)
- Drop shadow
- Hover: scale up, increase shadow
- z-index: 1000

**Interaction:**
- Opens WhatsApp Web or app
- Pre-fills message

---

### 4. Footer Component

**Structure:**
```
[Logo & Description] | [Quick Links] | [Contact Info] | [Social Media]
--------------------------------
[Copyright & Legal]
```

**Content Sections:**

#### About Section
- C4 Flow logo
- Brief description (1-2 sentences)

#### Quick Links
- Home
- About
- Classes
- Contact

#### Contact Info
- Address: 66 Albert Road, Woodstock Exchange, Cape Town
- Email: info@c4flow.co.za
- Phone: +27 65 391 7901
- Hours: By appointment only

#### Social Media
- Instagram: @c_4_flow
- Instructor Instagram: @cattleya_mystic_muse

#### Copyright
- © 2026 C4 Flow. All rights reserved.

**Responsive:**
- 4 columns (desktop)
- 2 columns (tablet)
- 1 column (mobile)

---

## Homepage Components

### 1. Hero Section

**Type:** Full-width hero with background image and text overlay

**Background Image:**
- Large studio photo (1920px+ width)
- Optimized for web
- Alt text: "C4 Flow pole dance studio interior"

**Content:**
- Main heading: "C-4 Flow" (Mynerve font, large)
- Subheading: "Move to Express" (Montserrat)
- Tagline: "Pole & Exotic Dance Studio" (Montserrat)

**Optional CTA:**
- "Book a Class" button
- "Learn More" button

**Styling:**
- Min height: 80vh (desktop), 60vh (mobile)
- Dark overlay on image (gradient)
- White text with text shadow
- Centered content

**CMS Fields:**
```typescript
{
  heroImage: Image
  mainHeading: string
  subheading: string
  tagline: string
  primaryCTA?: {
    text: string
    link: string
  }
  secondaryCTA?: {
    text: string
    link: string
  }
}
```

---

### 2. Features Section (4 Icons)

**Layout:** 4-column grid (responsive)

**Feature Cards:**

#### Card 1: Strength
```typescript
{
  icon: '/icons/strength.png'
  title: 'Strength'
  description: 'Build full-body strength through controlled lifts, holds, and dynamic movement.'
}
```

#### Card 2: Balance
```typescript
{
  icon: '/icons/balance.png'
  title: 'Balance'
  description: 'Develop balance and body awareness by training control, coordination, and precision.'
}
```

#### Card 3: Flexibility
```typescript
{
  icon: '/icons/flexibility.png'
  title: 'Flexibility'
  description: 'Increase flexibility over time through active stretching and fluid range-of-motion work.'
}
```

#### Card 4: Flow/Expression
```typescript
{
  icon: '/icons/flow.png'
  title: 'Flow'
  description: 'Learn how to move seamlessly, connect transitions, and express emotion through movement.'
}
```

**Component Structure:**
```jsx
<FeatureCard>
  <Icon /> // 100px circle
  <Title /> // Montserrat bold, 20px
  <Description /> // Montserrat regular, 16px
</FeatureCard>
```

**CMS Schema:**
```typescript
{
  features: Array<{
    icon: Image
    title: string
    description: text
    order: number
  }>
}
```

---

### 3. Classes Preview Section

**Section Title:** "Our Classes"  
**Subtitle:** "Private classes available too! Please Contact Us to book."

**Layout:** Grid of class cards (3 columns desktop, 1 column mobile)

**Class Cards (Homepage):**

Only show 3-4 featured classes on homepage with basic info:

```typescript
{
  className: string
  price: number // R150 (sale) or R200 (regular)
  duration: number // minutes
  schedule: string // "Mon & Fri"
  bookingLink: string
  image?: Image
}
```

**CTA:**
- "View All Classes" button → /classes
- Each card has "Book Now" button

---

### 4. Instructor Section

**Layout:** Image left, text right (or stacked on mobile)

**Content:**

**Section Title:** "Meet Your Instructor"

**Instructor Card:**
```typescript
{
  name: 'Cattleya'
  title: 'Pole dance instructor'
  photo: Image // Professional photo
  instagram: '@cattleya_mystic_muse'
  instagramUrl: 'https://www.instagram.com/cattleya_mystic_muse/'
  shortBio: string // 2-3 sentences for homepage
}
```

**Sample Short Bio:**
"Cattleya is an international performer from Eastern Europe with over 10 years of experience in pole dance, aerial arts, and movement. With 4 years of teaching experience, she creates a supportive space where students feel empowered and leave each class feeling stronger."

**CTA:**
- "Learn More" → /about#instructor
- Instagram icon link

---

## About Page Components

### 1. Mission Section

**Layout:** Full-width text block, centered

**Content:**
```
"At C-4 Flow, our mission is to create an inclusive, affirming space where people of all races, genders, body types, abilities, and experience levels feel welcome to explore movement as a form of self-expression. We are committed to fostering confidence, empowerment, and body autonomy through pole and exotic dance, while honoring individuality and celebrating diversity in all its forms."
```

**CMS Fields:**
```typescript
{
  sectionTitle: 'Our Mission'
  content: text (rich text)
  backgroundColor?: color
}
```

---

### 2. About Studio Section

**Section Title:** "Get to Know Us"

**Content (Key Points):**
- Welcoming, beginner-friendly studio
- Focus on self-expression
- Building strength, flexibility, and confidence
- Supportive, judgment-free community
- Movement can be powerful, playful, seductive, soft, or bold

**Full Text:**
```
C-4 Flow is a welcoming, beginner-friendly pole and exotic dance studio centered on movement as self-expression. Our classes help you build strength, flexibility, and confidence while reconnecting with your body. You might come to train athletically, explore sensual movement, or simply move in a way that feels good.

We believe dance is about more than tricks or choreography. It's about expression, emotion, and empowerment. At C-4 Flow, you're invited to show up as you are and move in ways that feel authentic to you: powerful, playful, seductive, soft, or bold.

Our studio is a supportive, judgment-free space built around community. From your very first class through every step of your pole journey, you'll find encouragement, respect, and room to grow at your own pace.
```

**CMS Fields:**
```typescript
{
  title: string
  content: richText
  ctaText?: string
  ctaLink?: string
}
```

---

### 3. Full Instructor Bio Section

**Section Title:** "Cattleya"  
**Subtitle:** "Lead Instructor & Studio Director"

**Layout:** Large photo left, bio right (or stacked mobile)

**Full Bio Content:**
```
Cattleya is an international performer from Eastern Europe with over 10 years of experience. Her background includes hip hop, disco dance, ballet, stage performance, burlesque, fire spinning, pole dance, and aerial arts.

Driven by a constant desire to grow, she continues to refine her skills while exploring new techniques and styles. One thing has always remained clear: dance is her life.

With four years of teaching experience, primarily through one-on-one sessions, Cattleya has developed a flexible, student-focused approach. She believes a teacher is only as good as their students, and her work has always centered on supporting and uplifting them.

Dance shaped her in a unique and personal way, helping her become the best version of herself; sharing that journey with others came naturally. She is passionate about creating a space where students feel happy, empowered, and leave each class feeling stronger than before.

Dance has been part of her life since childhood. It was her escape, her guidance, and her learning ground, shaping her values and sense of self. Today, it remains her daily therapy and the place where she can truly be herself.
```

**CMS Schema:**
```typescript
{
  name: string
  title: string
  photo: Image
  fullBio: richText
  instagram: string
  instagramUrl: string
  disciplines: Array<string> // ["pole dance", "aerial arts", etc.]
  yearsExperience: number
}
```

---

### 4. Studio Space Gallery

**Section Title:** "Our Space"  
**Subtitle:** "Step into our bright, beautiful, empowering studio."

**Layout:** Photo gallery/grid

**Content:**
- 6-12 high-quality studio photos
- Show poles, space, lighting, atmosphere
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**CMS Schema:**
```typescript
{
  title: string
  subtitle?: string
  images: Array<{
    image: Image
    alt: string
    caption?: string
  }>
}
```

---

### 5. Instagram Feed Section

**Section Title:** "Our Instagram"

**Content:**
- Embedded Instagram feed or latest posts
- Link to full Instagram profile

**CTA:**
- "Follow Us" button → Instagram
- Instagram handle: @c_4_flow

---

## Classes Page Components

### 1. Classes Intro Section

**Title:** "Our Classes"  
**Subtitle:** "Choose your flow: group energy or private focus."

**Introduction Text:**
```
At C-4 Flow, we offer both group and private pole and exotic dance classes across a variety of styles. You can book a single class or choose a package that fits your rhythm.

Group classes bring connection, shared energy, and a close, supportive studio vibe. Private sessions offer focused, one-on-one time to refine technique, build confidence, and move at your own pace. Beginners are always welcome, and every class is designed to meet you where you are.
```

---

### 2. Group Classes Grid

**Section Title:** "Group Classes"  
**Subtitle:** "Choose your own adventure and move to express."

**Class Card Schema:**
```typescript
{
  id: string
  className: string
  description?: richText // Full description
  price: number // R200
  duration: number // 60 minutes
  schedule: string // "Mon & Fri"
  level?: string // "All Levels", "Beginner", etc.
  image?: Image
  setmoreBookingUrl: string
  features?: Array<string> // ["Builds strength", "Floor work", etc.]
}
```

**Classes:**

#### 1. Exotic Baddies
```typescript
{
  className: 'Exotic Baddies'
  price: 200
  duration: 60
  schedule: 'Mon & Fri'
  bookingUrl: 'https://movetoexpresswithc4flow.setmore.com/classes/...'
}
```

#### 2. Dynamic Static
```typescript
{
  className: 'Dynamic Static'
  price: 200
  duration: 60
  schedule: 'Tues'
  bookingUrl: 'https://movetoexpresswithc4flow.setmore.com/book?...'
}
```

#### 3. Spinning Goddess
```typescript
{
  className: 'Spinning Goddess'
  price: 200
  duration: 60
  schedule: 'Mon, Tues & Thurs'
  bookingUrl: 'https://movetoexpresswithc4flow.setmore.com/book?...'
}
```

#### 4. Heels & Queens
```typescript
{
  className: 'Heels & Queens'
  price: 200
  duration: 60
  schedule: 'Sat'
  bookingUrl: 'https://movetoexpresswithc4flow.setmore.com/book?...'
}
```

**Component Structure:**
```jsx
<ClassCard>
  <Image /> // Optional class photo
  <Title />
  <PriceTag /> // "R200 | 60 min | Schedule"
  <Description /> // Optional full description
  <BookButton /> // "Book Now" → Setmore
</ClassCard>
```

---

### 3. Private Classes Section

**Content:**
```
Private classes available for personalized instruction.

Perfect for:
- One-on-one attention
- Custom choreography
- Working on specific techniques
- Flexible scheduling

Contact us to book your private session.
```

**CTA:**
- "Contact Us" button → /contact
- WhatsApp button (floating)

---

### 4. Class Details / FAQ Section

**Anchor:** #moreaboutclasses

**Potential Content:**
- What to bring (clothing, water, etc.)
- What to expect in your first class
- Class level descriptions
- Cancellation policy
- Package options

---

## Contact Page Components

### 1. Contact Header

**Title:** "Get in Touch"  
**Subtitle:** "Have questions? Want to book a class? We'd love to hear from you."

---

### 2. Contact Info Cards

**Layout:** 2x2 grid (desktop), stacked (mobile)

#### Card 1: Visit Us
```typescript
{
  icon: 'location'
  title: 'Visit Us'
  content: {
    address: {
      line1: '66 Albert Road'
      line2: 'Woodstock Exchange'
      city: 'Cape Town'
      province: 'Western Cape'
      postalCode: '8001'
    }
    mapLink: 'https://www.google.com/maps/...'
    parkingInfo: 'Free parking available in the adjacent lot. Street parking also available on surrounding streets.'
  }
}
```

#### Card 2: Email Us
```typescript
{
  icon: 'email'
  title: 'Email Us'
  email: 'info@c4flow.co.za'
  emailLink: 'mailto:info@c4flow.co.za'
}
```

#### Card 3: Studio Hours
```typescript
{
  icon: 'clock'
  title: 'Studio Hours'
  hours: 'By appointment only'
  specialNote: 'Sunday: Closed'
}
```

#### Card 4: WhatsApp Us
```typescript
{
  icon: 'whatsapp'
  title: 'WhatsApp Us'
  phone: '+27 65 391 7901'
  whatsappLink: 'https://wa.me/27653917901?text=...'
}
```

---

### 3. Contact Form

**Section Title:** "Send a message"

**Form Fields:**
```typescript
{
  email: {
    type: 'email'
    label: 'Your email'
    required: true
    placeholder: 'your@email.com'
    validation: 'email format'
  }
  message: {
    type: 'textarea'
    label: 'Message'
    required: true
    placeholder: 'Tell us about what you need...'
    minLength: 10
    rows: 6
  }
}
```

**Submit Button:** "Submit"

**Form Behavior:**
- Client-side validation
- Server-side submission (API route)
- Success message display
- Error handling
- Email sent to: info@c4flow.co.za

---

### 4. Map Section

**Section Title:** "Find us"

**Content:**
- Embedded Google Maps
- Shows Woodstock Exchange location
- Interactive map with zoom/pan
- "View larger map" link

**Implementation:**
```jsx
<iframe
  src="https://www.google.com/maps/embed?..."
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
```

---

### 5. Social Links Section

**Section Title:** "Follow us"

**Content:**
- Instagram icon + @c_4_flow
- Link to: https://www.instagram.com/c_4_flow/

---

## Sanity CMS Schema Recommendations

### Document Types Needed

#### 1. Site Settings (Singleton)
```typescript
{
  name: 'siteSettings'
  type: 'document'
  fields: [
    { name: 'siteName', type: 'string' }
    { name: 'siteUrl', type: 'url' }
    { name: 'logo', type: 'image' }
    { name: 'favicon', type: 'image' }
    { 
      name: 'announcementBar',
      type: 'object',
      fields: [
        { name: 'isActive', type: 'boolean' }
        { name: 'message', type: 'text' }
        { name: 'backgroundColor', type: 'color' }
      ]
    }
    {
      name: 'contact',
      type: 'object',
      fields: [
        { name: 'email', type: 'string' }
        { name: 'phone', type: 'string' }
        { name: 'whatsapp', type: 'string' }
        { name: 'address', type: 'object', fields: [...] }
      ]
    }
    {
      name: 'social',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url' }
        { name: 'instagramHandle', type: 'string' }
      ]
    }
  ]
}
```

#### 2. Page (for dynamic pages)
```typescript
{
  name: 'page'
  type: 'document'
  fields: [
    { name: 'title', type: 'string' }
    { name: 'slug', type: 'slug' }
    { name: 'seo', type: 'seo' } // SEO object
    { name: 'sections', type: 'array', of: [
      { type: 'hero' }
      { type: 'features' }
      { type: 'textBlock' }
      { type: 'gallery' }
      // ... more section types
    ]}
  ]
}
```

#### 3. Class
```typescript
{
  name: 'class'
  type: 'document'
  fields: [
    { name: 'className', type: 'string' }
    { name: 'slug', type: 'slug' }
    { name: 'description', type: 'array', of: [{ type: 'block' }] }
    { name: 'price', type: 'number' }
    { name: 'salePriceproduction', type: 'number' }
    { name: 'duration', type: 'number' }
    { name: 'schedule', type: 'string' }
    { name: 'level', type: 'string' }
    { name: 'image', type: 'image' }
    { name: 'bookingUrl', type: 'url' }
    { name: 'features', type: 'array', of: [{ type: 'string' }] }
    { name: 'order', type: 'number' }
    { name: 'isFeatured', type: 'boolean' }
  ]
}
```

#### 4. Instructor
```typescript
{
  name: 'instructor'
  type: 'document'
  fields: [
    { name: 'name', type: 'string' }
    { name: 'title', type: 'string' }
    { name: 'photo', type: 'image' }
    { name: 'shortBio', type: 'text' }
    { name: 'fullBio', type: 'array', of: [{ type: 'block' }] }
    { name: 'instagram', type: 'string' }
    { name: 'instagramUrl', type: 'url' }
    { name: 'disciplines', type: 'array', of: [{ type: 'string' }] }
    { name: 'yearsExperience', type: 'number' }
  ]
}
```

#### 5. Feature (for homepage features)
```typescript
{
  name: 'feature'
  type: 'document'
  fields: [
    { name: 'title', type: 'string' }
    { name: 'description', type: 'text' }
    { name: 'icon', type: 'image' }
    { name: 'order', type: 'number' }
  ]
}
```

---

## Content Guidelines

### Tone of Voice
- **Welcoming:** Approachable and friendly
- **Inclusive:** All genders, bodies, abilities welcome
- **Empowering:** Focus on confidence and self-expression
- **Professional:** Clear, organized information
- **Authentic:** Real, not overly polished

### Writing Style
- Active voice
- Short paragraphs (2-3 sentences)
- Conversational but professional
- Focus on benefits, not just features
- Use "you" to speak directly to reader

### Image Guidelines
- High resolution (1920px+ for heroes)
- Well-lit, bright studio shots
- Show diversity in images where possible
- Action shots of classes
- Instructor in teaching mode
- Studio space from various angles

---

## Integration Requirements

### Setmore Booking
- Direct links to specific class bookings
- Staff ID: 7872380e-7a3b-437c-bf6b-a3706e428023
- Product/Class IDs for each class
- "Book Now" buttons open in new tab or modal

### Google Maps
- Embedded map on contact page
- Correct coordinates: -33.926702, 18.4434095
- "View larger map" opens Google Maps
- Show parking areas if possible

### WhatsApp Integration
- Floating button on all pages
- Pre-filled message for easy contact
- Mobile: opens WhatsApp app
- Desktop: opens WhatsApp Web

### Instagram Integration
- Feed embed or manual updates
- Link to profile
- Show latest 6-9 posts
- Consider using Instagram API or third-party service

### Email Form
- Sends to: info@c4flow.co.za
- Consider using: Resend, SendGrid, or Mailgun
- Spam protection (reCAPTCHA or similar)
- Email templates for notifications

---

## Performance Optimization

### Images
- Next.js Image component
- WebP/AVIF formats
- Lazy loading (except hero)
- Responsive sizes
- Alt text for all images

### Fonts
- next/font for Google Fonts
- Subset to Latin only
- Preload critical fonts
- font-display: swap

### Code Splitting
- Dynamic imports for modals
- Lazy load components below fold
- Separate chunks for heavy components

### Caching
- Static page generation where possible
- ISR for class schedules
- Cache booking integration responses

---

This content structure provides everything needed to build the C4 Flow website in Next.js with Sanity CMS integration.
