import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hook/useChat'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from 'gsap/all';

gsap.registerPlugin(SplitText)

const Dashboard = () => {
  const chat = useChat()
  const [ chatInput, setChatInput ] = useState('')
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false)
  const [ mousePosition, setMousePosition ] = useState({ x: 0, y: 0 })
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useGSAP(()=>{
    const splitHeading = new SplitText(".zarvis",{
      type:"chars",
    })

    const tl = gsap.timeline();
    tl.from(".zarvis-logo",{
      y:50,
      duration:0.5,
      opacity:0       
    }) 
    tl.from(splitHeading.chars,{
      y:100,
      opacity:0,
      ease:"power2.out",
      stagger:0.05,
      duration:0.5
    }).from(".zarvis-text1",{
      rotate:10,
      duration:0.5,
      y:50,   
  
    },"combine").from(".zarvis-text2",{
      y:50,
      duration:0.5,
      rotate:10
    },"combine")
     
    
    
  },[])

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, [])

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return;
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setIsSidebarOpen(false) 
  }

  const handleNewChat = () => {
    chat.handleNewChat();
    setIsSidebarOpen(false);
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    chat.handleDeleteChat(chatId, currentChatId);
  }

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
  );
  
  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
  );

  const TrashIcon = () => (
    <svg className="w-4 h-4 text-red-400 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
  );

  const PlusIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
  );

  const SendIcon = () => (
    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
  );

  return (
    <main 
      onMouseMove={handleMouseMove}
      className='relative min-h-screen w-full bg-[#030715] overflow-hidden text-white font-sans selection:bg-indigo-500/30'
    >
      {/* Interactive Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(89, 62, 243, 0.06), transparent 40%)`
        }}
      />
      
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none' />

      <section className='mx-auto flex h-screen w-full relative z-10'>
        <div className='md:hidden absolute top-0 left-0 w-full p-4 flex items-center justify-between z-50 bg-[#030712]/80 backdrop-blur-md border-b border-white/5'>
          <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 overflow-hidden'>Zarvis AI</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='p-2 text-gray-300 hover:text-white transition'>
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <aside className={`
          fixed md:relative z-40 h-full w-72 shrink-0 flex flex-col
          bg-[#0a0f1c]/80 backdrop-blur-2xl border-r border-white/5 
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className='p-6 hidden md:block'>
            <h1 className='text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]'>Zarvis</h1>
          </div>

          <div className='px-4 pt-20 md:pt-0 mb-4'>
            <button 
              onClick={handleNewChat}
              className='flex items-center justify-center w-full rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all duration-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-95'
            >
              <PlusIcon />
              New Chat
            </button>
          </div>

          <div className='flex-1 overflow-y-auto px-3 space-y-2 pb-4 scrollbar-thin scrollbar-thumb-white/10'>
            {Object.values(chats).map((chatSession) => {
              const isActive = currentChatId === chatSession.id;
              return (
                <div 
                  key={chatSession.id}
                  onClick={() => openChat(chatSession.id)}
                  className={`group relative flex items-center justify-between cursor-pointer w-full rounded-xl px-4 py-3 text-sm transition-all duration-300 overflow-hidden hover:scale-[1.01] ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 border border-indigo-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-white' 
                      : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
                  <span className='truncate pr-6 relative z-10'>
                    {chatSession.title || 'Untitled Session'}
                  </span>
                  
                  <button 
                    onClick={(e) => handleDeleteChat(e, chatSession.id)}
                    className={`group/btn absolute right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] z-20 hover:scale-110 active:scale-90 ${isActive ? 'opacity-100' : ''}`}
                    title="Delete Chat"
                  >
                    <TrashIcon />
                  </button>
                </div>
              )
            })}
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className='fixed inset-0 bg-black/60 backdrop-blur-md z-30 md:hidden transition-all'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <section className='relative flex h-full min-w-0 flex-1 flex-col pt-16 md:pt-0'>
          <div className='flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth flex flex-col relative z-10'>
            {!currentChatId && (
              <div className='flex flex-col items-center justify-center flex-1 min-h-[60vh] text-center opacity-70 animate-message'>

                <div className='  w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-transform duration-700 hover:scale-110 hover:rotate-12 overflow-hidden'>
                  <svg className="zarvis-logo w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>

                <h1 className='zarvis text-5xl md:text-7xl font-bold tracking-tight bg-clip-text  bg-gradient-to-r from-indigo-400 to-purple-500 mb-4 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] whitespace-nowrap flex overflow-hidden gap-[1.5px] text-blue-500'>Zarvis AI</h1>

                <div className='overflow-hidden'>
                  <h2 className='zarvis-text1 text-xl md:text-2xl font-light text-gray-200'>How can I help you today?</h2>
                </div>

                <span className='overflow-hidden'>
                  <p className='zarvis-text2 text-sm text-gray-500 mt-2 max-w-md'>Enter a query below to start a new intelligent session.</p>
                </span>
              </div>  
            )}
            
            {chats[currentChatId]?.messages?.map((message, index) => (
              <div
                key={message._id || index}
                className={`flex w-full animate-message ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${index === 0 ? 'mt-auto' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.2)]'
                      : 'rounded-bl-sm bg-[#111827]/80 border border-white/5 text-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <footer className='p-4 md:p-6 bg-gradient-to-t from-[#030712] via-[#030712]/95 to-transparent backdrop-blur-md relative z-20'>
            <div className='max-w-4xl mx-auto'>
              <form onSubmit={handleSubmitMessage} className='relative flex items-center group transition-transform duration-300'>
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur-xl transition-opacity duration-500 opacity-0 group-focus-within:opacity-100 pointer-events-none' />
                <input
                  type='text'
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder='Ask anything...'
                  className='w-full relative z-10 rounded-2xl border border-white/10 bg-[#0f1523]/80 backdrop-blur-lg pl-6 pr-16 py-4 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-indigo-500/50 focus:bg-[#131b2c] focus:shadow-[0_0_25px_rgba(99,102,241,0.2)] focus:scale-[1.01]'
                />
                <button
                  type='submit'
                  disabled={!chatInput.trim()}
                  className='absolute right-2 z-20 p-2.5 rounded-xl bg-indigo-500 text-white transition-all duration-300 hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none hover:scale-110 active:scale-95'
                >
                  <SendIcon />
                </button>
              </form>
              <div className='flex flex-col items-center mt-3 gap-1'>
                <p className='text-center text-xs text-gray-600 transition-colors duration-300 hover:text-gray-400'>AI can make mistakes. Consider verifying important information.</p>
                <p className='text-center text-xs text-gray-600 font-medium tracking-wide'>Developed by Vijay Singh Dobal</p>
              </div>
            </div>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard