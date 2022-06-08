export default function isBlank(value: string) {
    return /^\s*$/.test(value)
}
