export default function trunc(addr: string) {
    if (/^0x[a-f\d]{40}$/i.test(addr)) {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    return addr
}
