import Navbar from '../src/components/Navbar/Navbar'
import Sidebar from '../src/components/Sidebar/Sidebar'
import styles from '../styles/Chat.module.scss'

const Chat = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <Sidebar />
      </div>
    </div>
  )
}

export default Chat
