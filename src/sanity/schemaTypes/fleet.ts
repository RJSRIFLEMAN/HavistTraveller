import { defineField, defineType } from "sanity";

export const fleet = defineType({
  name: "fleet",
  title: "Fleet",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Fleet name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "model",
      title: "Bus model",
      type: "string",
      description: "For example, Jetbus 5 Adiputro.",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "capacity",
      title: "Passenger capacity",
      type: "number",
      validation: (rule) => rule.required().integer().min(1).max(100),
    }),
    defineField({
      name: "coverImage",
      title: "Fleet photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "facilities",
      title: "On-board facilities",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "isActive",
      title: "Visible on website",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "model", media: "coverImage" },
  },
});
