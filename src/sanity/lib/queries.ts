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
    "discountClassIds": discountClasses[]->_id,
    showInSchedule,
    scheduleText
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
      backgroundImage{
        ...,
        "lqip": asset->metadata.lqip
      },
      overlayLogo{
        ...,
        "lqip": asset->metadata.lqip
      },
      images[]{
        ...,
        "lqip": asset->metadata.lqip
      },
      _type == "instructorSection" => {
        ...,
        instructor->{
          name,
          title,
          experience,
          photo{
            ...,
            "lqip": asset->metadata.lqip
          },
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
  *[_type == "danceClass" && active != false] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    description,
    tagline,
    days,
    category,
    image{
      ...,
      "lqip": asset->metadata.lqip
    },
    price,
    salePrice,
    duration,
    bookingUrl
  }
`);

export const CLASS_BY_SLUG_QUERY = defineQuery(`
  *[_type == "danceClass" && slug.current == $slug && active != false][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    shortDescription,
    image{
      ...,
      "lqip": asset->metadata.lqip
    },
    price,
    salePrice,
    duration,
    bookingUrl
  }
`);

// ===== Weekly Schedule =====

export const WEEKLY_SCHEDULE_QUERY = defineQuery(`
  *[_type == "weeklySchedule"][0]{
    slots[danceClass->active != false]{
      _key,
      day,
      time,
      "className": danceClass->name,
      "classId": danceClass->_id,
      "price": danceClass->price,
      "salePrice": danceClass->salePrice,
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
    photo{
      ...,
      "lqip": asset->metadata.lqip
    },
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
    photo{
      ...,
      "lqip": asset->metadata.lqip
    },
    bio,
    shortBio,
    instagramUrl,
    bookingUrl
  }
`);
