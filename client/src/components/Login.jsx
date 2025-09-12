import React from 'react'
import { useAppContext } from '../contexts/AppContexts';

const Login = () => {
  const { setShowUserLogin,searchQuery,setSearchQuery} = useAppContext();

  const [state, setState] = React.useState("login"); // "login" or "register"
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setUser({
        email:"test2@gmail.com",
        name:"test",
    })
    setShowUserLogin(false);
  }

  return (
    <div 
      onClick={() => setShowUserLogin(false)} 
      className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'
    >
      <form 
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()} 
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Title */}
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name field only for Sign Up */}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              placeholder="type here" 
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
              type="text" 
              required 
            />
          </div>
        )}

        {/* Email field */}
        <div className="w-full">
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            placeholder="type here" 
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
            type="email" 
            required 
          />
        </div>

        {/* Password field */}
        <div className="w-full">
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            placeholder="type here" 
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
            type="password" 
            required 
          />
        </div>

        {/* Toggle between login / register */}
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setState("login");
              }} 
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setState("register");
              }} 
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        {/* Submit button */}
        <button 
          type="submit" 
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login;
