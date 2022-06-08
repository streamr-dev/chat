export default function formatDate(timestamp: number) {
    const d = new Date(timestamp)

    const [Y, M, D, h, m, s] = [
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    ].map((val: number) => `${val < 10 ? '0' : ''}${val}`)

    return `${Y}/${M}/${D} ${h}:${m}:${s}`
}
