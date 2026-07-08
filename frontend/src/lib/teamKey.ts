export function normalizeTeamKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
