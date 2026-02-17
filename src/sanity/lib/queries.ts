import { defineQuery } from "next-sanity";

// ===== Site Settings =====

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    motto,
    logo,
    favicon,
    contactEmail,
    phone,
    whatsappNumber,
    whatsappMessage,
    address,
    instagramUrl,
    instructorInstagramUrl,
    bookingUrl,
    mapsUrl,
    defaultOgImage
  }
`);

// ===== Announcement Bar =====

export const ANNOUNCEMENT_BAR_QUERY = defineQuery(`
  *[_type == "announcementBar"][0]{
    enabled,
    text,
    link,
    _updatedAt,
    discountEnabled,
    discountPercent,
    discountScope,
    "discountClassIds": discountClasses[]->_id
  }
`);

// ===== Pages =====

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    ogImage,
    sections[]{
      ...,
      _type == "instructorSection" => {
        ...,
        instructor->{
          name,
          title,
          experience,
          photo,
          bio,
          shortBio,
          instagramUrl,
          bookingUrl
        }
      }
    }
  }
`);

export const ALL_PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{"slug": slug.current}
`);

// ===== Dance Classes =====

export const ALL_CLASSES_QUERY = defineQuery(`
  *[_type == "danceClass"] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    image,
    price,
    salePrice,
    duration,
    bookingUrl
  }
`);

export const CLASS_BY_SLUG_QUERY = defineQuery(`
  *[_type == "danceClass" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    shortDescription,
    image,
    price,
    salePrice,
    duration,
    bookingUrl
  }
`);

// ===== Weekly Schedule =====

export const WEEKLY_SCHEDULE_QUERY = defineQuery(`
  *[_type == "weeklySchedule"][0]{
    slots[]{
      _key,
      day,
      time,
      "className": danceClass->name,
      "bookingUrl": danceClass->bookingUrl
    },
    "notices": notices[active == true]{
      _key,
      style,
      emoji,
      title,
      body,
      linkUrl,
      linkLabel,
      startDate,
      endDate
    }
  }
`);

// ===== Testimonials =====

export const ALL_TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(order asc, _createdAt desc){
    _id,
    quote,
    name,
    role,
    photo,
    rating
  }
`);

// ===== Instructors =====

export const ALL_INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor"]{
    _id,
    name,
    title,
    experience,
    photo,
    bio,
    shortBio,
    instagramUrl,
    bookingUrl
  }
`);
