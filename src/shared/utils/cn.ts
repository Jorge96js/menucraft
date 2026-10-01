/**
 * Utility para combinar clases CSS condicionalmente.
 * Similar a clsx + tailwind-merge.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
