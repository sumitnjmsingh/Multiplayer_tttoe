import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import socketIOClient from 'socket.io-client';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import useLogout from "../hooks/useLogout";
import {motion} from "framer-motion"
import { FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import "../App.css"
import toast ,{ Toaster } from "react-hot-toast";
import CustomToastWithInput from './CustomToastWithInput';

const ENDPOINT = 'http://localhost:4000'; 

function App() {
  

  const { loading, logout } = useLogout();
  const navigate=useNavigate();
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState(0);
  const [name,setname]=useState([]);
  const [pl_n,setpl_n]=useState("");
  const [message,setmessage]=useState("");
  const [messageToShow,setmessageToShow]=useState([]);
  const [profile,setprofile]=useState([])

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);
    
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
  
  
  const handleRoomCreated = ({ roomName, pl_n,profile_player }) => {
    setRoomName(roomName);
    
  };

  const handleRoomJoined = ({ roomName, pl_n }) => {
    setRoomName(roomName);
    
  };

  const handleStartGame = ({ player_name, player,profile_player }) => {
    setname(player_name);
    setPlayers(player);
    setCurrentTurn(0); // Player 1 starts first
    console.log(profile_player)
    setprofile(profile_player);
   
  };

  const handleMoveMade = ({ index, symbol }) => {
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    setCurrentTurn(currentTurn === 0 ? 1 : 0); // Switch turns
  };
  

  const handleGameOver = (result) => {
    if (result === 'draw') {
      alert('It\'s a draw!');
    } else {
      const winner = result === 'X' ? 'Player 1' : 'Player 2'; 
      alert(`${winner} wins!`);
    }
    
    const shouldReset = window.confirm("Do you want to play again?");
        if (shouldReset) {
          resetGame();
        } else {
          socket.emit("del",{id:socket.id,roomName});
          setRoomName('');
          setPlayers([]);
          setBoard(Array(9).fill(null));
          setmessage("");
          setmessageToShow([]);
          setname([]);
          setpl_n("");
          navigate("/Game") ;
        }
      

    
  };

  const handleGetMessage = (data) => {
    setmessageToShow(prevmessage=>[...prevmessage,data]);
    console.log(data);
  };
  const handleremove=({profile_player,players,player_name})=>{
      setprofile(profile_player)
      setname(player_name);
      setPlayers(players);
  }

  const handleRoomFull = () => {
    toast('Room is full, cannot join');
    // Handle UI to show room is full
  };

  socket.on('roomCreated', handleRoomCreated);
  socket.on('roomJoined', handleRoomJoined);
  socket.on('startGame', handleStartGame);
  socket.on('moveMade', handleMoveMade);
  socket.on('gameOver', handleGameOver);
  socket.on("getmessage", handleGetMessage);
  socket.on('roomFull', handleRoomFull);
  socket.on("remove",handleremove);

  return () => {
    socket.off('roomCreated', handleRoomCreated);
    socket.off('roomJoined', handleRoomJoined);
    socket.off('startGame', handleStartGame);
    socket.off('moveMade', handleMoveMade);
    socket.off('gameOver', handleGameOver);
    socket.off('getmessage', handleGetMessage);
    socket.off('roomFull', handleRoomFull);
    socket.off("remove",handleremove);
  };


    }
  }, [socket, board, players]);

  const removed=()=>{
    socket.emit("del",{id:socket.id,roomName});
    setRoomName("");
          setPlayers([]);
          setBoard(Array(9).fill(null));
          setmessage("");
          setmessageToShow([]);
          setname([]);
          setpl_n("");
    navigate("/Game") ;
  }

  const createRoom = () => {
    
    


    const roomName = prompt('Enter room name:');
    if (roomName) {
     
      const userProfile = JSON.parse(localStorage.getItem('TTToe-user')).profilePic;
      
      setprofile([userProfile])
      socket.emit('createRoom', {roomName,pl_n,profilePic: userProfile});
    }
  };
  const handlemessage=(e)=>{
    console.log(socket);
    socket.emit("sendmessage",message);
    setmessage("");
  }

  const joinRoom = () => {
    const roomName = prompt('Enter room name:');
    if (roomName) {
      const userProfile = JSON.parse(localStorage.getItem('TTToe-user')).profilePic;
    
    
      socket.emit('joinRoom', {roomName,pl_n,profilePic: userProfile});
    }
  };

  const makeMove = (index) => {
    if (board[index] === null && players[currentTurn] === socket.id) {
      socket.emit('makeMove', { roomName, index, symbol: currentTurn === 0 ? 'X' : 'O' });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentTurn(0); 
    socket.emit('resetGame', {roomName,profile});
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('back.jpeg')]  bg-no-repeat bg-cover relative overflow-hidden">
      <div id="hero-shape">
                <div id="hero-1"></div>
                <div id="hero-2"></div>
                <div id="hero-3"></div>
      </div>
      
      <div className='z-[100] fixed bottom-0 left-0 p-2'>{!loading ? (
				<CgLogOut className=' text-black cursor-pointer text-3xl ' onClick={logout} />
			) : (
				<span className='loading loading-spinner'></span>
			)}</div>
      <motion.h1 initial={{x:-200}} animate={{x:0}} transition={{duration:0.6,ease:"linear"}} className="lg:text-5xl text-4xl w-screen text-center  font-bold mb-4  bg-gradient-to-r from-red-900 via-red-500 to-purple-500 bg-clip-text text-transparent font-serif backdrop-blur-lg py-2 ">Tic Tac Toe Multiplayer</motion.h1>
      {!roomName ? (
        <div className="flex flex-col items-center justify-center space-y-2 space-x-4 mb-4 w-[100%] backdrop-blur-md py-2">
            <div className='flex justify-center items-center w-[100%]'>
                <input type="text" value={pl_n} onChange={(e)=>{setpl_n(e.target.value)}} placeholder='Enter your name...' className=' font-serif outline-none w-[40%] p-1 rounded-md'></input>
                
            </div>
            <div className='flex justify-center aligns-center flex-wrap gap-2  '>
                 <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded font-serif" onClick={createRoom}>
                      Create Room
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded font-serif" onClick={joinRoom}>
                      Join Room
                </button>
          </div>
          
        </div>
      ):
       (
        <div className='w-screen text-center backdrop-blur-sm relative'>
          <div className="mb-4 text-white font-bold font-serif ">
            Room: {roomName}
          </div>
          <div className="mb-4 flex gap-2 items-center justify-center text-white   font-bold font-serif">
           <p>Players:</p>  {name.map((player, index) => (<div className='flex flex-wrap gap-1' key={index}>
              <span className='text-white' ><span className='text-4xl text-blue-800'>{index + 1}:</span> {player}</span>
              <div className='w-[60px] h-[60px] rounded-full border '><img className='w-full h-full rounded-full' src={profile[index]}></img></div></div>
            ))}
            
          </div >
          <div className='flex  justify-center items-center gap-2 flex-wrap px-[3vw]  pt-2  '>
                    <div className="grid grid-cols-3 gap-2 lg:mb-4 mb-[2px] ">
                      {board.map((cell, index) => (
                        <div key={index} className="border-[3px] border-black rounded-md hover:bg-[rgba(0,0,0,0.3)] hover:scale-[1.1] lg:w-[100px] lg:h-[100px] w-[60px] h-[60px] p-2 text-3xl text-center text-black flex justify-center items-center cursor-pointer"
                          onClick={() => makeMove(index)}>
                          {cell}
                        </div>
                      ))}
                    </div>
                    <div className='mb-2  '>
                      <div className=' font-serif  text-black overflow-auto lg:w-[298px] lg:h-[300px] w-[180px] h-[180px]  border-[1px] rounded-md border-black flex flex-col p-[2px] gap-[2vw] '>{messageToShow.map((meg,index)=>{
                          return (index%2)?(<div key={index} className='max-w-[70%] break-words self-end'><p  className='text-[15px] bg-[rgba(0,0,0,0.5)] text-white rounded-md p-1 leading-normal'>{meg}</p></div>):(<div key={index} className='max-w-[70%] break-words self-start'><p  className='text-[15px] bg-[rgba(255,255,255,0.5)] rounded-md p-1  leading-normal'>{meg}</p></div>)
                      })}</div>
                      <div className='flex items-center rounded-md lg:w-[300px] w-[180px]'><input placeholder='Type Your Message...' value={message} onChange={(e)=>{setmessage(e.target.value)}} type="text" className='p-1 outline-none rounded-tl-md rounded-bl-md w-[70%] '></input><button onClick={handlemessage} className='bg-blue-600 p-1 text-white font-serif rounded-tr-md rounded-br-md w-[30%]'>SEND</button></div>
                    </div>
          </div>
          <div className='absolute bottom-0 right-2 w-[30px] h-[30px] '><button onClick={removed}><FaPersonWalkingArrowLoopLeft className='text-3xl text-white ' /></button></div>
        </div>
      )}
      
         <div className='relative lg:fixed bottom-0 left-0 w-full px-10 py-4 '>
             <div className='flex flex-col flex-wrap items-center text-center justify-center text-red-500'>
              <p className='lg:text-[18px] text-[12px]'>sumit@iitm<span className='text-red-500 lg:text-[20px] text-[12px]'>-2024</span >-Present < FaInstagram  className='  inline'/> <FaFacebook  className='  inline'/>  </p>
              <p className='lg:text-[18px] text-[12px]'>b22137@students.iitmandi.ac.in Get in Touch for more details 88405XXXXX</p>
            </div>
         </div>
    </div>
  );
}

export default App;
