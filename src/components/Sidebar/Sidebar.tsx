import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Room from './Room';
import styles from './Sidebar.module.scss';
import { faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const Sidebar = (): JSX.Element => {
  return <div className={styles.container}>
    <button className={styles.addRoom}>Add new room</button>
    <Room />
  </div>
}

export default Sidebar;