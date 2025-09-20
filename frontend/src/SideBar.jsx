import React, { useEffect } from 'react'
import './SideBar.css'
import { useContext } from 'react'
import MyContext from './MyContext.jsx'
import { v1 as uuidv1 } from "uuid";


const SideBar = () => {
      const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats} = useContext(MyContext);

      const getAllThreads = async ()=>{
      try {
        const response =await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/thread`)
        const res = await response.json();
        const filterData = res.map(thread=>({ threadId: thread.threadId,title: thread.title}))
        
        setAllThreads(filterData)
        //threadId,title
      } catch (err) {
        console.log(err);
        
      }
      }

      // useEffect(()=>{
      //   getAllThreads();
      // },[currThreadId])

      const createNewChat =()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([])
      }

      const changeThread =async(newThreadId)=>{
      setCurrThreadId(newThreadId);
      try{
         const response = await  fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/thread/${newThreadId}`)
         const res = await response.json();
         setPrevChats(Array.isArray(res) ? res : []);
         setNewChat(false);
         setReply(null)
         console.log(res);
         
      }catch(err){
        console.log(err);
        
      }
      }

      const deleteThread =async(threadId)=>{
        try{
           const response =  await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/thread/${threadId}`,{method:"DELETE"})
           const res = await response.json()
           console.log(res);

           //updated threads
           setAllThreads(Prev =>Prev.filter(thread=>thread.threadId !== threadId));
           if(threadId===currThreadId){
            createNewChat();
           }
           
        }catch(err){
            console.log(err);
            
        }
      }

  return (
    <section className='sideBar'>
      {/* new chat  */}
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt='gpt logo' className='logo' />
       <span> <i className="fa-solid fa-pen-to-square"></i></span>
      </button>
      {/* history */}
      <ul className='history'>
        {
           allThreads?.map((thread,idx)=>(
            <li key={idx} 
            onClick={(e)=>changeThread(thread.threadId)}
            className={thread.threadId===currThreadId ? "highlighted": ""}
            >{thread.title}
            <i className="fa-solid fa-trash"
            onClick={(e)=>{
              e.stopPropagation(); //stop event bubbling
              deleteThread(thread.threadId);
            }}
            ></i></li>
           )) 
        }
      </ul>

      {/* sign */}

    <div className="sign">
      <p>By Aman &hearts;</p>
    </div>
    </section>
  )
}

export default SideBar