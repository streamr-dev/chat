import styles from './Navbar.module.scss'

const Navbar = (): JSX.Element => {
  return (
    <nav className={styles.navbar}>
      <h4 className={styles.title}>Streamr.Chat</h4>
      <button className={styles.connect}>Connect a wallet</button>
    </nav>
  )
}

export default Navbar
