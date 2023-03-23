export default function getCommitId(): string | undefined {
    return import.meta.env.VITE_COMMIT_ID || undefined
}
