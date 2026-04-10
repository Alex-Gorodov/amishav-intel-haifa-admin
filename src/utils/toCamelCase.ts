export const toCamelCase = (str: string) =>
  str
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

export const toPascalCase = (str: string) =>
  str
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
