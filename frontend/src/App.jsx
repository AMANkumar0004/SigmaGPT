import './App.css';
import ChatWindow from "./ChatWindow.jsx";
import SideBar from "./SideBar.jsx";
import MyContext from "./MyContext.jsx"; // ✅ default import (no curly braces)
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  // ✅ All global states
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1()); // unique thread id
  const [prevChats, setPrevChats] = useState([]);           // ✅ fixed typo (was "pervChats")
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([])

  // ✅ Values passed into context
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,   
    newChat, setNewChat,
    allThreads,setAllThreads

  };

  return (
    <div className="app">
      {/* ✅ Wrap app with Context provider */}
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
