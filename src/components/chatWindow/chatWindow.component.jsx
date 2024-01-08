import InputComponent from "../Input/input.component";
import ChatContacts from "../chatContacts/chatContacts.component";

const ChatWindow = () => {
  return (
    <div className="chatWindow_container">
      ChatWindow
      <ChatContacts></ChatContacts>
      <InputComponent></InputComponent>
    </div>
  );
};

export default ChatWindow;
