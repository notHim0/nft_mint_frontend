import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
const Navbar = () => (
	<nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
		<div className="max-w-7xl mx-auto flex justify-between items-center">
			<Link to="/" className="text-xl font-bold text-blue-500 tracking-tighter">
				Funding<span className="text-white">Fans</span>
			</Link>
			<div className="space-x-8">
				<Link
					to="/"
					className="text-gray-300 hover:text-blue-400 transition-colors"
				>
					Gallery
				</Link>
				<Link
					to="/mint"
					className="text-gray-300 hover:text-blue-400 transition-colors"
				>
					Mint NFT
				</Link>
				<Link
					to="/donate"
					className="text-gray-300 hover:text-blue-400 transition-colors"
				>
					Donate
				</Link>
			</div>
			{/* Your WalletMultiButton should stay here so it's visible on all pages */}
			<div className="scale-90">
				<WalletMultiButton />
			</div>
		</div>
	</nav>
);
export default Navbar;
