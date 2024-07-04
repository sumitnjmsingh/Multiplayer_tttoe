import React from 'react'
import { Link,useNavigate } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../hooks/useSignup";
// import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        console.log(inputs)
		await signup(inputs);
        navigate("/Game");
	};


  return (
    <div className='p-4 h-screen flex justify-center items-center bg-[url("back.jpeg")] bg-no-repeat bg-cover bg-center'>
    <div className='flex flex-col items-center justify-center lg:min-w-96 min-w-70 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-white'>
					Sign Up <span className='text-blue-500'> TTToe</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text text-white'>Full Name</span>
						</label>
						<input
							type='text'
							placeholder='John Doe'
							className='w-full input input-bordered  h-10'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text text-white'>Username</span>
						</label>
						<input
							type='text'
							placeholder='johndoe'
							className='w-full input input-bordered h-10'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text text-white'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text text-white'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

					<Link to="/Login" 
					
						className='text-sm hover:underline hover:text-white mt-2 inline-block text-white'
						
					>
						Already have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading} >
                        {loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</div>
		</div>
        </div>
  )
}

export default Register