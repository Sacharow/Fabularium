import Footer from "../components/Footer"

function Home() {
    return (
        <div className="flex flex-col items-center h-screen justify-center pt-24">
            <h1 className="text-4xl font-bold">Welcome to Fabularium</h1>
            <p className="text-lg mt-4">Your gateway to epic adventures and legendary tales.</p>
            <img src="/sky1.jpg" alt="Home Illustration" className="mt-6 w-1/2 h-auto" />
            <Footer />
        </div>
    )
}

export default Home