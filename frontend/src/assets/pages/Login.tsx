import { useState } from "react"
import { GoogleIcon } from "../components/ui/GoogleIcon";
import { FacebookIcon } from "../components/ui/FacebookIcon";
import CustomCheckbox from "../components/ui/CustomCheckbox";

function Login() {
    //const [username, setUsername] = useState("");
    //const [password, setPassword] = useState("");
    //const [email, setEmail] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [remember, setRemember] = useState(false);

    const thirdParty = [
        {icon: GoogleIcon, name: "Google"},
        {icon: FacebookIcon, name: "Facebook"}
    ]


    const inputButton = `border border-orange-900 rounded py-2 px-4 mb-4 text-sm`
    const loginButton = `cursor-pointer w-full bg-yellow-300 text-black font-bold py-2 px-4 rounded shadow-lg shadow-yellow-300 hover:scale-105 hover:bg-yellow-400 hover:shadow-yellow-400 text-sm`;
    const thirdPartyButton = `flex items-center gap-2 text-xl px-9 rounded cursor-pointer hover:scale-105`

    return (
        <div className="flex flex-col w-1/3 pt-6 justify-center mx-auto">
            <div className="border-2 rounded-xl py-6 px-12 bg-orange-950 border-orange-900 shadow-lg shadow-orange-400">
                <div className="text-4xl font-bold mb-4 text-center">
                    <h1>Welcome Back,</h1>
                    <h1>Adventurer</h1>
                </div>
                <div className="text-sm text-center text-gray-500">
                    <p>Your next great quest awaits.</p>
                </div>
                {!isRegistering && (
                <div>
                    <div className="flex flex-col mt-6">
                        <input type="text" placeholder="Enter your username" className={inputButton} />
                        <input type="password" placeholder="Enter your password" className={inputButton} />
                    </div>
                    <div className="flex justify-between pb-2">
                        <div>
                            <CustomCheckbox id="remember" checked={remember} onChange={setRemember} label={<span>Remember me</span>} />
                        </div>
                        <div>
                            <a href="#" className="text-sm text-yellow-300 hover:underline">Forgot password?</a>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className={loginButton}>Log In</button>
                        <button className={loginButton} onClick={() => setIsRegistering(true)}>Register</button>
                    </div>
                </div>
                )}
                {isRegistering && (
                <div>
                    <div className="flex flex-col mt-6">
                        <input type="text" placeholder="Enter your email" className={inputButton} />
                        <input type="password" placeholder="Enter your password" className={inputButton} />
                        <input type="password" placeholder="Repeat your password" className={inputButton} />
                    </div>  
                    <div className="flex gap-2">
                        <button className={loginButton}>Register</button>
                        <button className={loginButton} onClick={() => setIsRegistering(false)}>Back to Log In</button>
                    </div>
                </div>
                )}
            </div>
            <div className="w-full flex gap-3 justify-center pt-6">
                {thirdParty.map((Item, index) => {
                    const Icon = Item.icon;
                    return (
                        <button key={index} className={thirdPartyButton}>
                            <Icon  className="w-12 h-12" />
                            <p>{Item.name}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Login