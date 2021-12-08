import Room from './Room'
import styles from './Sidebar.module.scss'

const Sidebar = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <button className={styles.addRoom}>Add new room</button>
      <Room />
    </div>
  )
}

export default Sidebar
