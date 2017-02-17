export function isNullOrWhitespace(obj) {
    if (typeof obj === 'undefined' || obj == null) return true;
    return obj.toString().replace(/\s/g, '').length < 1;
}