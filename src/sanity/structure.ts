import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  BellIcon,
  DocumentIcon,
  UsersIcon,
  CalendarIcon,
  EnvelopeIcon,
} from "@sanity/icons";

const SINGLETONS = ["siteSettings", "announcementBar"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("C4 Flow")
    .items([
      // Singletons
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.listItem()
        .title("Announcement Bar")
        .icon(BellIcon)
        .child(
          S.document()
            .schemaType("announcementBar")
            .documentId("announcementBar")
        ),

      S.divider(),

      // Pages
      S.listItem()
        .title("Pages")
        .icon(DocumentIcon)
        .child(S.documentTypeList("page").title("Pages")),

      S.divider(),

      // Content
      S.listItem()
        .title("Instructors")
        .icon(UsersIcon)
        .child(S.documentTypeList("instructor").title("Instructors")),
      S.listItem()
        .title("Dance Classes")
        .icon(CalendarIcon)
        .child(S.documentTypeList("danceClass").title("Dance Classes")),

      S.divider(),

      // Contact submissions
      S.listItem()
        .title("Contact Submissions")
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList("contactSubmission")
            .title("Contact Submissions")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
        ),

      S.divider(),

      // Everything else (filtered)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !SINGLETONS.includes(listItem.getId() as string) &&
          ![
            "page",
            "instructor",
            "danceClass",
            "contactSubmission",
          ].includes(listItem.getId() as string)
      ),
    ]);
