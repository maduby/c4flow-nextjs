import type { SchemaTypeDefinition } from "sanity";

// Documents
import { siteSettings } from "./documents/siteSettings";
import { announcementBar } from "./documents/announcementBar";
import { page } from "./documents/page";
import { instructor } from "./documents/instructor";
import { danceClass } from "./documents/danceClass";
import { contactSubmission } from "./documents/contactSubmission";
import { discount } from "./documents/discount";
import { weeklySchedule } from "./documents/weeklySchedule";
import { testimonial } from "./documents/testimonial";

// Page builder objects
import { hero } from "./objects/hero";
import { featureGrid } from "./objects/featureGrid";
import { classesSection } from "./objects/classesSection";
import { instructorSection } from "./objects/instructorSection";
import { scheduleSection } from "./objects/scheduleSection";
import { richTextSection } from "./objects/richTextSection";
import { gallerySection } from "./objects/gallerySection";
import { ctaSection } from "./objects/ctaSection";
import { contactFormSection } from "./objects/contactFormSection";
import { mapSection } from "./objects/mapSection";
import { testimonialsSection } from "./objects/testimonialsSection";
import { faqSection } from "./objects/faqSection";
import { pricingSection } from "./objects/pricingSection";
import { classDetailsSection } from "./objects/classDetailsSection";
import { contactInfoSection } from "./objects/contactInfoSection";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  announcementBar,
  discount,
  page,
  instructor,
  danceClass,
  contactSubmission,
  weeklySchedule,
  testimonial,

  // Page builder objects
  hero,
  featureGrid,
  classesSection,
  instructorSection,
  scheduleSection,
  richTextSection,
  gallerySection,
  ctaSection,
  contactFormSection,
  mapSection,
  testimonialsSection,
  faqSection,
  pricingSection,
  classDetailsSection,
  contactInfoSection,
];
