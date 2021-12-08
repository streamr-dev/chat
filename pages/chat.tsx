import ChatWindow from "../src/components/ChatWindow/ChatWindow"
import Navbar from "../src/components/Navbar/Navbar"
import Sidebar from "../src/components/Sidebar/Sidebar"
import styles from '../styles/Chat.module.scss'

const Chat = (): JSX.Element => {
    return <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
            <Sidebar />
            <ChatWindow />
        </div>
    </div>
}

export default Chat
