// Same mailto format as the old contact page.
export function buildMailto(name, message) {
  return `mailto:jozef@waldhauser.sk?subject=Contact%20Form%20Submission&body=----- Contact Form Submission ----- %0A%0AName:%20${encodeURIComponent(name)}%0A%0AMessage:%0A${encodeURIComponent(message)}%0A%0A-----------------------------------`;
}
