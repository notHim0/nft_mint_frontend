import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const Donate = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	const [mintAddr, setMintAddr] = useState("");
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);

	const handleDonate = async () => {
		if (!publicKey) return alert("Connect Wallet!");
		if (!mintAddr || !amount) return alert("Fill in all fields");

		setLoading(true);
		try {
			// 1. Get Owner
			const res = await fetch(
				`https://nft-mint-5je4.onrender.com/api/get-nft-owner/${mintAddr}`
			);
			const data = await res.json();

			if (!data.success)
				throw new Error("Owner not found for this Mint Address");

			const ownerPubkey = new PublicKey(data.ownerWallet);

			// 2. Send SOL
			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: publicKey,
					toPubkey: ownerPubkey,
					lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
				})
			);

			const signature = await sendTransaction(transaction, connection);
			alert(`Donation Sent! Signature: ${signature}`);
			setAmount("");
		} catch (err) {
			console.error(err);
			alert("Transaction Failed: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 max-w-md w-full mt-6 md:mt-0">
			<h3 className="text-2xl font-bold mb-4 text-green-400">
				Donate to Owner
			</h3>
			<p className="text-gray-400 text-sm mb-4">
				Want to support your favar? Send SOL directly to its current owner.
			</p>

			<div className="space-y-4">
				<input
					type="text"
					className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-green-500 outline-none text-white"
					placeholder="NFT Mint Address"
					value={mintAddr}
					onChange={(e) => setMintAddr(e.target.value)}
				/>

				<div className="relative">
					<input
						type="number"
						className="appearance-none w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-green-500 outline-none text-white pr-12"
						placeholder="Amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
					<span className="absolute right-3 top-2 text-gray-500 font-bold">
						SOL
					</span>
				</div>

				<button
					onClick={handleDonate}
					disabled={loading}
					className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
						loading
							? "bg-gray-600 cursor-not-allowed"
							: "bg-linear-to-r from-green-600 to-white hover:from-green-700 hover:to-teal-700"
					}`}
				>
					{loading ? "Sending..." : "Donate SOL"}
				</button>
			</div>
		</div>
	);
};

export default Donate;
