import styles from './Room.module.scss';

type RoomProps = {
  name?: string;
  image?: string;
}

const Room = ({ image, name }: RoomProps) => {
  return <div className={styles.roomSelector}>
    <div className={styles.roomText}>
      <span className={styles.roomName}>random-name-abc</span>
      <span className={styles.roomMessage}>Empty roomw</span>
    </div>
  </div>
}

export default Room;