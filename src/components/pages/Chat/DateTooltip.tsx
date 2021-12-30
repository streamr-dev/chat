import styled from 'styled-components'

type Props = {
    className?: string,
    timestamp: number,
}

function formatDate(timestamp: number) {
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

const Inner = styled.div`
    background: #ffffff;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    position: relative;
`

const Pointer = styled.div`
    background: #ffffff;
    border-radius: 0.125rem;
    bottom: -0.375rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    height: 0.75rem;
    left: 50%;
    position: absolute;
    transform: rotate(45deg) translateX(-50%);
    width: 0.75rem;
`

const UnstyledDateTooltip = ({ className, timestamp }: Props) => (
    <div className={className}>
        <Pointer />
        <Inner>
            {formatDate(timestamp)}
        </Inner>
    </div>
)

const DateTooltip = styled(UnstyledDateTooltip)`
    background: #ffffff;
    bottom: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #323232;
    font-size: 0.625rem;
    left: 50%;
    line-height: normal;
    margin-bottom: 0.25rem;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    transition: 0.2s;
    transition-property: visibility, opacity;
    transition-delay: 0.2s, 0s;
    user-select: none;
    visibility: hidden;
    white-space: nowrap;
`

export default DateTooltip
