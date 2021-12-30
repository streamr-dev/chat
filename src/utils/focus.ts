export default function focus(input: HTMLInputElement | null): void {
    if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
    }
}
