import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-02-17",
  useCdn: false,
});

async function seed() {
  console.log("Seeding Sanity content...\n");

  // Site Settings (singleton)
  const settings = await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "C-4 Flow",
    tagline: "Pole & Exotic Dance Studio",
    motto: "Move to Express",
    contactEmail: "info@c4flow.co.za",
    phone: "+27 65 391 7901",
    whatsappNumber: "27653917901",
    whatsappMessage: "Hey, I'm interested in booking a class with you!",
    address: {
      street: "66 Albert Road",
      building: "Woodstock Exchange",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001",
    },
    instagramUrl: "https://www.instagram.com/c_4_flow/",
    instructorInstagramUrl: "https://www.instagram.com/cattleya_mystic_muse/",
    bookingUrl: "https://movetoexpresswithc4flow.setmore.com/",
    mapsUrl:
      "https://www.google.com/maps/place/Woodstock+Exchange/@-33.926702,18.4434095,17z/",
  });
  console.log("✓ Site Settings:", settings._id);

  // Announcement Bar (singleton)
  const announcement = await client.createOrReplace({
    _id: "announcementBar",
    _type: "announcementBar",
    enabled: true,
    text: "New classes starting soon! Book your spot today.",
    link: "https://movetoexpresswithc4flow.setmore.com/",
  });
  console.log("✓ Announcement Bar:", announcement._id);

  // Instructor
  const instructor = await client.createOrReplace({
    _id: "instructor-cattleya",
    _type: "instructor",
    name: "Cattleya",
    title: "Pole dance instructor",
    experience: "4 years experience",
    shortBio:
      "Cattleya began her pole journey four years ago and hasn't looked back since. Teaching both beginners and advanced students, she believes pole is for every body — no matter your fitness level or experience.",
    instagramUrl: "https://www.instagram.com/cattleya_mystic_muse/",
    bookingUrl: "https://movetoexpresswithc4flow.setmore.com/",
  });
  console.log("✓ Instructor:", instructor._id);

  // Dance Classes
  const classes = [
    {
      _id: "class-group-pole",
      _type: "danceClass",
      name: "Group Pole Class",
      slug: { current: "group-pole-class" },
      shortDescription:
        "Join our fun and empowering group pole classes. Perfect for all levels — from complete beginners to experienced dancers.",
      price: 200,
      duration: 60,
      schedule: [
        { _key: "mon", day: "Monday", time: "6 PM" },
        { _key: "wed", day: "Wednesday", time: "6 PM" },
      ],
      bookingUrl: "https://movetoexpresswithc4flow.setmore.com/",
      order: 1,
    },
    {
      _id: "class-private-session",
      _type: "danceClass",
      name: "Private Session",
      slug: { current: "private-session" },
      shortDescription:
        "One-on-one private sessions tailored to your goals. Get personalised attention and progress at your own pace.",
      price: 350,
      duration: 60,
      schedule: [],
      bookingUrl: "https://movetoexpresswithc4flow.setmore.com/",
      order: 2,
    },
    {
      _id: "class-exotic-pole",
      _type: "danceClass",
      name: "Exotic Pole Class",
      slug: { current: "exotic-pole-class" },
      shortDescription:
        "Express yourself through exotic pole dance. Learn fluid transitions, floorwork, and choreography in a supportive environment.",
      price: 200,
      duration: 60,
      schedule: [
        { _key: "thu", day: "Thursday", time: "6 PM" },
        { _key: "sat", day: "Saturday", time: "11 AM" },
      ],
      bookingUrl: "https://movetoexpresswithc4flow.setmore.com/",
      order: 3,
    },
  ];

  for (const cls of classes) {
    const result = await client.createOrReplace(cls);
    console.log("✓ Class:", result.name, `(${result._id})`);
  }

  // Homepage
  const homePage = await client.createOrReplace({
    _id: "page-home",
    _type: "page",
    title: "Home",
    slug: { current: "home" },
    seoTitle: "C-4 Flow | Pole & Exotic Dance Studio Cape Town",
    seoDescription:
      "C4 Flow Studio offers pole dancing classes Cape Town loves — group and private classes for all levels at our inclusive Woodstock studio.",
    sections: [
      {
        _key: "hero",
        _type: "hero",
        headline: "C-4 Flow",
        subtitle: "Pole & Exotic Dance Studio",
        tagline: "Move to Express",
      },
      {
        _key: "features",
        _type: "featureGrid",
        heading: "What We Offer",
        features: [
          {
            _key: "f1",
            title: "Pole Dancing",
            description:
              "From beginner to advanced, our pole classes build strength, flexibility, and confidence.",
          },
          {
            _key: "f2",
            title: "Exotic Dance",
            description:
              "Express yourself through fluid movement, floorwork, and choreography.",
          },
          {
            _key: "f3",
            title: "Private Sessions",
            description:
              "One-on-one sessions tailored to your goals with personalised coaching.",
          },
        ],
      },
      {
        _key: "classes",
        _type: "classesSection",
        heading: "Our Classes",
        subtitle:
          "Choose from group classes or private sessions — there's something for every body.",
        showBookingNote: true,
      },
      {
        _key: "instructor",
        _type: "instructorSection",
        heading: "Meet Your Instructor",
        instructor: { _type: "reference", _ref: "instructor-cattleya" },
      },
      {
        _key: "schedule",
        _type: "scheduleSection",
        heading: "Weekly Schedule",
        subtitle: "Find a class time that works for you.",
      },
      {
        _key: "cta",
        _type: "ctaSection",
        heading: "Ready to Flow?",
        subtitle:
          "Book your first class today and discover what your body can do.",
        buttonText: "Book Now",
        buttonUrl: "https://movetoexpresswithc4flow.setmore.com/",
        style: "gradient",
      },
    ],
  });
  console.log("✓ Homepage:", homePage._id);

  // About Page
  const aboutPage = await client.createOrReplace({
    _id: "page-about",
    _type: "page",
    title: "About",
    slug: { current: "about" },
    seoTitle: "About C-4 Flow | Pole Dance Studio Cape Town",
    seoDescription:
      "Learn about C-4 Flow, our instructor Cattleya, and our inclusive pole and exotic dance studio in Woodstock, Cape Town.",
    sections: [
      {
        _key: "hero",
        _type: "hero",
        headline: "About C-4 Flow",
        subtitle: "Our Story",
      },
      {
        _key: "story",
        _type: "richTextSection",
        heading: "Our Story",
        layout: "centered",
        content: [
          {
            _key: "p1",
            _type: "block",
            style: "normal",
            children: [
              {
                _key: "c1",
                _type: "span",
                text: "C-4 Flow is a pole and exotic dance studio based in the heart of Woodstock, Cape Town. Founded with the belief that dance is for every body, we provide a safe, inclusive, and empowering space for people of all levels and backgrounds to explore movement and self-expression.",
              },
            ],
          },
        ],
      },
      {
        _key: "instructor",
        _type: "instructorSection",
        heading: "Meet Your Instructor",
        instructor: { _type: "reference", _ref: "instructor-cattleya" },
      },
      {
        _key: "gallery",
        _type: "gallerySection",
        heading: "Our Space",
        subtitle: "Located at the Woodstock Exchange, Cape Town",
      },
    ],
  });
  console.log("✓ About Page:", aboutPage._id);

  // Classes Page
  const classesPage = await client.createOrReplace({
    _id: "page-classes",
    _type: "page",
    title: "Classes",
    slug: { current: "classes" },
    seoTitle: "Pole Dancing Classes Cape Town | C-4 Flow",
    seoDescription:
      "Browse our pole dancing and exotic dance classes in Cape Town. Group classes, private sessions, and more at C-4 Flow Studio.",
    sections: [
      {
        _key: "hero",
        _type: "hero",
        headline: "Our Classes",
        subtitle: "Find your flow",
      },
      {
        _key: "classes",
        _type: "classesSection",
        heading: "Available Classes",
        subtitle:
          "All classes welcome beginners. No prior experience needed — just bring yourself and an open mind.",
        showBookingNote: true,
      },
      {
        _key: "schedule",
        _type: "scheduleSection",
        heading: "Weekly Schedule",
        subtitle: "Plan your week with C-4 Flow.",
      },
      {
        _key: "cta",
        _type: "ctaSection",
        heading: "Ready to start?",
        subtitle: "Your first class is just a click away.",
        buttonText: "Book a Class",
        buttonUrl: "https://movetoexpresswithc4flow.setmore.com/",
        style: "gradient",
      },
    ],
  });
  console.log("✓ Classes Page:", classesPage._id);

  // Contact Page
  const contactPage = await client.createOrReplace({
    _id: "page-contact",
    _type: "page",
    title: "Contact",
    slug: { current: "contact" },
    seoTitle: "Contact C-4 Flow | Pole Dance Studio Cape Town",
    seoDescription:
      "Get in touch with C-4 Flow. Send us a message, find us on the map, or reach out via WhatsApp.",
    sections: [
      {
        _key: "hero",
        _type: "hero",
        headline: "Get in Touch",
        subtitle: "We'd love to hear from you",
      },
      {
        _key: "contactForm",
        _type: "contactFormSection",
        heading: "Send a message",
        subtitle: "We'll get back to you as soon as possible.",
        successMessage: "Thank you! We'll get back to you as soon as possible.",
      },
      {
        _key: "map",
        _type: "mapSection",
        heading: "Find Us",
        additionalInfo:
          "We're located at the Woodstock Exchange, 66 Albert Road, Cape Town. Street parking available.",
      },
    ],
  });
  console.log("✓ Contact Page:", contactPage._id);

  console.log("\n✅ Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
