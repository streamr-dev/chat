export default function focus(input: HTMLInputElement | HTMLTextAreaElement | null): void {
    if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
    }
}
