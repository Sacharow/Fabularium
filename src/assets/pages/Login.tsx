function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="border-2 rounded-xl py-6 px-12 bg-orange-950 border-orange-900 shadow-lg shadow-orange-400">
                <div className="text-4xl font-bold mb-4 text-center">
                    <h1>Welcome Back,</h1>
                    <h1>Adventurer</h1>
                </div>
                <div className="text-sm text-center text-gray-500">
                    <p>Your next great quest awaits.</p>
                </div>
                <div className="flex flex-col mt-6">
                    <input type="text" placeholder="Enter your username" className="border border-orange-900 rounded py-2 px-4 mb-4" />
                    <input type="password" placeholder="Enter your password" className="border border-orange-900 rounded py-2 px-4 mb-4" />
                </div>
                <div className="flex justify-between">
                    <div>
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm text-gray-500">Remember me</label>
                    </div>
                    <div>
                        <a href="#" className="text-sm text-yellow-300 hover:underline">Forgot password?</a>
                    </div>
                </div>
                <div>
                    <button className="cursor-pointer w-full bg-yellow-300 text-black font-bold py-2 px-4 rounded mt-6 shadow-lg shadow-yellow-300 hover:scale-105">Log In</button>
                </div>
            </div>
        </div>
    )
}

export default Login