import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
    const navigate = useNavigate();
     
    const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
       
        navigate("/Game");
	};


  return (
    <div className='p-4 h-screen flex justify-center items-center bg-[url("back.jpeg")] bg-no-repeat bg-cover bg-center'>
    <div className='flex flex-col justify-center items-center lg:min-w-96 min-w-70 mx-auto'>
        <div className=' border-solid border-[1px] border-white w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
            <h1 className='text-3xl font-semibold text-center text-gray-600'>Login
                <span className='text-blue-800'>TTToe</span>
            </h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className='label p-2'><span className='text-base label-text'>Username</span></label>
                    <input type="text" placeholder='Enter Username' className=' w-full input input-bordered h-10' value={username}
							onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div>
                    <label className='label'><span className='text-base label-text'>Password</span></label>
                    <input type="password" placeholder='Enter Password' className=' w-full input input-bordered h-10' value={password}
							onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <Link to="/"   className="text-sm hover:underline hover:text-white mt-2 inline-block">Don't have an account?</Link>
                <div>
                    <button className='btn btn-block btn-sm mt- ' disabled={loading}>
                          {loading ? <span className='loading loading-spinner '></span> : "Login"}
                    </button>
                </div>
            </form>

        </div>

    </div>
    </div>
    
  )
}

export default Login