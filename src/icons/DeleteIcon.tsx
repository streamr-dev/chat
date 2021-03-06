import { SVGAttributes } from 'react'

const DeleteIcon = (props: SVGAttributes<SVGElement>) => (
    <svg
        {...props}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.25 2C4.25 1.17157 4.92157 0.5 5.75 0.5H10.25C11.0784 0.5 11.75 1.17157 11.75 2V3.5H13.2423C13.2469 3.49996 13.2515 3.49996 13.2562 3.5H14.75C15.1642 3.5 15.5 3.83579 15.5 4.25C15.5 4.66421 15.1642 5 14.75 5H13.9483L13.2978 14.1069C13.2418 14.8918 12.5886 15.5 11.8017 15.5H4.19834C3.41138 15.5 2.75822 14.8918 2.70215 14.1069L2.05166 5H1.25C0.835786 5 0.5 4.66421 0.5 4.25C0.5 3.83579 0.835786 3.5 1.25 3.5H2.74381C2.74846 3.49996 2.75311 3.49996 2.75774 3.5H4.25V2ZM5.75 3.5H10.25V2H5.75V3.5ZM3.55548 5L4.19834 14H11.8017L12.4445 5H3.55548Z"
            fill="#59799C"
        />
    </svg>
)

export default DeleteIcon
