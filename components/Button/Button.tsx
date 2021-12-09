import './Button.scss'

type ButtonProps = {
  onClick: () => any;
  children: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({onClick, children}: ButtonProps) => {
    return <button>{children}</button>
}