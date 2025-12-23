import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
	createNft,
	mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";

const MintNFT = () => {
	const wallet = useWallet();
	const [file, setFile] = useState(null);
	const [name, setName] = useState("");
	const [status, setStatus] = useState("");
	const [symbol, setSymbol] = useState("");
	const [loading, setLoading] = useState(false);
	const [description, setDescription] = useState("");

	const handleMint = async () => {
		if (!wallet.connected) return alert("Connect Wallet!");

		setLoading(true);
		setStatus("Preparing Mint Address...");

		try {
			// A. Setup Umi
			const umi = createUmi("https://api.devnet.solana.com")
				.use(walletAdapterIdentity(wallet))
				.use(mplTokenMetadata());

			// B. PRE-GENERATE the Mint Signer
			const mint = generateSigner(umi);
			const mintAddress = mint.publicKey.toString();

			setStatus("Uploading to Pinata with Mint Address...");

			// C. Upload to Backend (Pass the mintAddress)
			const formData = new FormData();
			formData.append("image", file);
			formData.append("name", name);
			formData.append("description", description);
			formData.append("symbol", symbol);
			formData.append("mintAddress", mintAddress);

			const res = await fetch(
				"https://nft-mint-5je4.onrender.com/api/upload-metadata",
				{
					method: "POST",
					body: formData,
				}
			);
			const data = await res.json();

			// D. Now Mint on-chain using that same signer
			setStatus("Finalizing Mint on Solana...");
			await createNft(umi, {
				mint, // Use the same signer we generated in step B
				name: name,
				uri: data.metadataURI,
				sellerFeeBasisPoints: percentAmount(0),
			}).sendAndConfirm(umi);

			setStatus(`✅ Success! Mint Address: ${mintAddress}`);
		} catch (err) {
			console.error(err);
			setStatus("❌ Error: " + err.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-md w-full">
			<h3 className="text-2xl font-bold mb-4 text-blue-400">Mint New NFT</h3>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-400 mb-1">
						NFT Name
					</label>
					<input
						type="text"
						className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white"
						placeholder="e.g. Super Rare #001"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-400 mb-1">
						NFT Symbol
					</label>
					<input
						type="text"
						className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white"
						placeholder="symbol"
						value={symbol}
						onChange={(e) => setSymbol(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-400 mb-1">
						NFT Description
					</label>
					<input
						type="text"
						className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white"
						placeholder="Super cool nft"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-400 mb-1">
						Upload Image
					</label>
					<input
						type="file"
						className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-900 file:text-purple-300 hover:file:bg-purple-800"
						onChange={(e) => setFile(e.target.files[0])}
					/>
				</div>

				<button
					onClick={handleMint}
					disabled={loading}
					className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
						loading
							? "bg-gray-600 cursor-not-allowed"
							: "bg-linear-to-r from-blue-600 to-white hover:to-blue-700"
					}`}
				>
					{loading ? "Processing..." : "Mint NFT"}
				</button>

				{status && (
					<div
						className={`p-3 rounded text-sm break-all ${
							status.includes("Success")
								? "bg-green-900/50 text-green-300"
								: "bg-blue-900/50 text-blue-300"
						}`}
					>
						{status}
					</div>
				)}
			</div>
		</div>
	);
};

export default MintNFT;
