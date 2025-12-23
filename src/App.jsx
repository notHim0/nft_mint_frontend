import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MintNFT from "./MintNFT";
import Donate from "./Donate";
import NFTGallery from "./NFTGallery";
import Navbar from "./Components/Navbar";
import { WalletContextProvider } from "./WalletContextProvider";

function App() {
	return (
		<WalletContextProvider>
			<Router>
				<div className="min-h-screen bg-black text-white">
					<Navbar />

					<main className="max-w-7xl mx-auto py-10 px-4">
						<Routes>
							<Route path="/" element={<NFTGallery />} />
							<Route
								path="/mint"
								element={
									<div className="flex justify-center">
										<MintNFT />
									</div>
								}
							/>
							<Route
								path="/donate"
								element={
									<div className="flex justify-center">
										<Donate />
									</div>
								}
							/>
						</Routes>
					</main>
				</div>
			</Router>
		</WalletContextProvider>
	);
}

export default App;
