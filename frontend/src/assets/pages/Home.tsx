function Home() {
    return (
        <div className="flex flex-col items-center h-screen">
            <div className="relative w-2/3 h-1/2 mt-32">
                <img src="ratton.png" alt="Background" className="w-full h-full object-cover" />
                <div className="absolute bottom-12 right-24 flex items-center justify-center">
                    <h1 className="text-4xl text-white font-bold text-center drop-shadow-lg">Massive Rattón</h1>
                </div>
            </div>
        </div>
    )
}

export default Home