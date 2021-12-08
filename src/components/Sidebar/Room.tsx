import styles from './Room.module.scss'

type RoomProps = {
  name?: string
  image?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Room = ({ image, name }: RoomProps): JSX.Element => {
  return (
    <div className={styles.roomSelector}>
      <div className={styles.roomText}>
        <span className={styles.roomName}>random-name-abc</span>
        <span className={styles.roomMessage}>Empty room</span>
      </div>
    </div>
  )
}

export default Room
