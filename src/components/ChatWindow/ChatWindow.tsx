import styles from './ChatWindow.module.scss';

const ChatWindow = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        random-name-abc
        <div className={styles.buttons}>
          <button className={styles.button}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.8985 0.815217C11.2077 0.506052 11.709 0.506052 12.0181 0.815217L15.1848 3.98188C15.494 4.29105 15.494 4.7923 15.1848 5.10147L4.89313 15.3931C4.74466 15.5416 4.5433 15.625 4.33333 15.625H1.16667C0.729441 15.625 0.375 15.2706 0.375 14.8333V11.6667C0.375 11.4567 0.458407 11.2554 0.606874 11.1069L8.52338 3.19038L10.8985 0.815217ZM9.08333 4.8696L1.95833 11.9946V14.0417H4.00541L11.1304 6.91668L9.08333 4.8696ZM12.25 5.79709L13.5054 4.54168L11.4583 2.4946L10.2029 3.75001L12.25 5.79709Z" fill="#59799C"/>
</svg>
          </button>
          <button className={styles.button}>
<svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 4C9.10457 4 10 3.10457 10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.89543 6 2C6 3.10457 6.89543 4 8 4Z" fill="#59799C"/>
<path d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z" fill="#59799C"/>
<path d="M14 4C15.1046 4 16 3.10457 16 2C16 0.89543 15.1046 0 14 0C12.8954 0 12 0.89543 12 2C12 3.10457 12.8954 4 14 4Z" fill="#59799C"/>
</svg>

          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow;