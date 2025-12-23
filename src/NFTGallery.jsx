import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NftGallery = () => {
	const [nfts, setNfts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const PINATA_GATEWAY =
		"https://rose-gentle-earthworm-349.mypinata.cloud/ipfs";

	useEffect(() => {
		const fetchGalleryData = async () => {
			try {
				const res = await fetch(
					"https://nft-mint-5je4.onrender.com/api/all-nfts"
				);
				const data = await res.json();

				const fileList = data.nfts;

				const metadataFiles = fileList.filter(
					(file) => file.mime_type === "application/json"
				);

				const detailedNfts = await Promise.all(
					metadataFiles.map(async (file) => {
						try {
							const contentResponse = await fetch(
								`${PINATA_GATEWAY}/${file.cid}`
							);
							const jsonContent = await contentResponse.json();

							return {
								name: jsonContent.name || "Unnamed NFT",
								description: jsonContent.description || "No description",
								// Look for mintAddress inside the JSON properties
								mintAddress: jsonContent.mintAddress || "N/A",
								// Ensure the image URI works in a browser
								displayImage: jsonContent.image.replace(
									"ipfs://",
									`${PINATA_GATEWAY}/`
								),
								cid: file.cid,
							};
						} catch (err) {
							console.error("Failed to read JSON content for CID:", file.cid);
							return null;
						}
					})
				);
				setNfts(detailedNfts.filter((nft) => nft !== null));
			} catch (error) {
				console.error("Gallery loading error:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchGalleryData();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
				<p className="ml-4 text-gray-400">Loading collection...</p>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-12">
			<h2 className="text-3xl font-bold text-white mb-10 text-center">
				NFT Collection
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{nfts.map((nft, index) => (
					<div
						key={index}
						className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/50 transition-all duration-300"
					>
						{/* Image */}
						<div className="aspect-square bg-black overflow-hidden">
							<img
								src={nft.displayImage}
								alt={nft.name}
								className="w-full h-full object-cover"
								onError={(e) => {
									e.target.src =
										"https://via.placeholder.com/400?text=Image+Not+Found";
								}}
							/>
						</div>

						{/* Text Details */}
						<div className="p-4">
							<h3 className="text-white font-bold text-lg truncate">
								{nft.name}
							</h3>
							<p className="text-gray-400 text-xs mt-1 h-8 line-clamp-2">
								{nft.description}
							</p>

							<div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-2">
								<div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold">
									<span>Mint Address</span>
									<button
										onClick={() => {
											navigator.clipboard.writeText(nft.mintAddress);
											alert("Copied to clipboard");
											return;
										}}
										className="text-purple-400 hover:text-purple-300 transition-colors"
									>
										Copy
									</button>
								</div>
								<p className="text-[11px] font-mono text-gray-300 truncate bg-black/50 p-2 rounded">
									{nft.mintAddress}
								</p>

								<a
									href={`https://explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`}
									target="_blank"
									rel="noreferrer"
									className="mt-2 block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-900/20"
								>
									View on Explorer
								</a>
							</div>
							<button
								onClick={() => navigate(`/donate?address=${nft.mintAddress}`)}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white my-2 py-2 rounded-lg text-xs font-bold"
							>
								Donate to Creator
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default NftGallery;
