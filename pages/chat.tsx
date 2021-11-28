import Sidebar from "../src/components/Sidebar/Sidebar"
import styles from '../styles/Chat.module.scss'

const Chat = (): JSX.Element => {
  return <div className={styles.container}>
    <h1>
      Chat
    </h1>
    <Sidebar />
  </div>
}

export default Chat