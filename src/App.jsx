import { WalletContextProvider } from "./WalletContextProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MintNFT from "./MintNFT";
import Donate from "./Donate";

function App() {
	return (
		<WalletContextProvider>
			<div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white">
				{/* Navbar */}
				<nav className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
					<h1 className="text-3xl font-extrabold bg-linear-to-r from-blue-400 to-blue-900 bg-clip-text text-transparent">
						SolNFT Hub
					</h1>
					<WalletMultiButton className="bg-purple-600! hover:bg-purple-700! transition-colors" />
				</nav>

				{/* Main Content */}
				<main className="max-w-6xl mx-auto p-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start justify-items-center">
						{/* Left Column: Minting */}
						<section className="w-full flex flex-col items-center">
							<MintNFT />
						</section>

						{/* Right Column: Donation */}
						<section className="w-full flex flex-col items-center">
							<Donate />
						</section>
					</div>
				</main>
			</div>
		</WalletContextProvider>
	);
}

export default App;
