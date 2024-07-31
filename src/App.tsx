import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "./thirdweb.svg";
import { client } from "./client";
import { TransactionButton } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";
import { prepareTransaction } from "thirdweb";
import { createThirdwebClient, toWei } from "thirdweb";
import { defineChain } from "thirdweb";
import { getContract } from "thirdweb";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractMetadata,
  MediaRenderer,
  ThirdwebProvider,
} from "@thirdweb-dev/react";
import React, { useEffect, useState, useRef } from "react";

// const client = createThirdwebClient({ clientId: "2856bd276e9de4c42deb81f50dc85d55" });

export function App() {
  const chainop = defineChain(8453);
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(8453),
    address: "0x61bDB6468254B092C7Cc8A5ee66090BF745A4c84",
  });

  let upsupply: number = 5; // Example value for upsupply

  // Convert "1.0" ether to wei
  let baseValueInWei = BigInt(toWei("1.0"));

  // Convert 10 * upsupply to wei
  let upsupplyValueInWei = BigInt(toWei((10 * upsupply).toString()));

  // Perform the addition in wei
  let valueup = baseValueInWei + upsupplyValueInWei;

  const address = useAddress();
  // const { contract } = useContract(
  //   process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
  //   "edition"
  // );
  // const { data: contractMetadata } = useContractMetadata(contract);
  const [clientSecret, setClientSecret] = useState("");


  const [showVideo, setShowVideo] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showGif, setShowGif] = useState(false);

  const handleMintingProcess = async () => {
    setShowGif(true);
    // Assuming the GIF runs for 5 seconds (5000 ms)
    await new Promise(resolve => setTimeout(resolve, 5000));

    setShowGif(false);
    setLoading(true);

    try {
      // Fetch random tokens
      const resp = await fetch("https://servergupta.sheikhstudios.live/api/random-tokens");
      if (!resp.ok) {
        console.error("Failed to fetch random tokens");
        throw new Error('Failed to fetch random tokens');
      }

      const json = await resp.json();
      setImages(json.images);

      // Collect all tokenIds in an array
      const tokenIds = json.images.map((img: any, index: any) => index); // Modify this logic based on how you want to generate tokenIds

      // Ensure we are sending an array of exactly three tokenIds
      if (tokenIds.length !== 3) {
        throw new Error('Invalid tokenIds format. Expected an array of three token IDs.');
      }

      // Claim NFTs
      const res = await fetch('https://sheikhstudios.live/api/generate', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json" // Set content type to application/json
        },
        body: JSON.stringify({
          address: address,
          tokenIds: tokenIds
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(`Failed to claim NFTs: ${errorBody.message}`);
      }

      const responseBody = await res.json();
      console.log(`Claimed NFTs with tokenIds ${tokenIds.join(', ')}: `, responseBody);

      // Show success alert
      alert(`Successfully claimed NFTs with tokenIds ${tokenIds.join(', ')}`);
      alert('NFT MINTED');
    } catch (error) {
      console.error("Error during minting process: ", error);

      // Check if error is an instance of Error and use its message, otherwise default to a generic message
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert("Error during minting process: " + errorMessage); // Show error alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        {/* <Header /> */}

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Example app",
              url: "https://example.com",
            }}
          />
        </div>

        <TransactionButton
          transaction={() => {
            // Create a transaction object and return it
            const transaction = prepareTransaction({
              to: "0xecAE9860D37a1DbA220FB30Dfd7deFe49E5555d1",
              chain: chainop,
              client: client,
              value: valueup,
            });
            return transaction;
          }
        }
        // onTransactionConfirmed={(receipt) => {
        //   console.log("Transaction confirmed", receipt.transactionHash);
        // }}
        onError={(error) => {
          console.error("Transaction error", error);
          handleMintingProcess();
        }}
        >
          Confirm Transaction
        </TransactionButton>

        {/* <ThirdwebResources /> */}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <img
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-violet-500"> vite </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}

function ThirdwebResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="thirdweb SDK Docs"
        href="https://portal.thirdweb.com/typescript/v5"
        description="thirdweb TypeScript SDK documentation"
      />

      <ArticleCard
        title="Components and Hooks"
        href="https://portal.thirdweb.com/typescript/v5/react"
        description="Learn about the thirdweb React components and hooks in thirdweb SDK"
      />

      <ArticleCard
        title="thirdweb Dashboard"
        href="https://thirdweb.com/dashboard"
        description="Deploy, configure, and manage your smart contracts from the dashboard."
      />
    </div>
  );
}

function ArticleCard(props: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={props.href + "?utm_source=vite-template"}
      target="_blank"
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    </a>
  );
}
