export function hasAnyRole(
    roles: string[],
    allowed: string[]
): boolean {
    return allowed.some(role => roles.includes(role));
}
