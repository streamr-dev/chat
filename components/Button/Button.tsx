import './Button.scss'

type ButtonProps = {
  onClick: () => any;
  children: any;
}

const Button = ({onClick, children}: ButtonProps) => {
  return <button>{children}</button>
}