export function i18title (obj, locale) {
  return obj[`title_${locale}`] || obj.title
}