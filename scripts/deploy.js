
async function main() {

  const Wallet = await hre.ethers.getContractFactory("Wallet");
  const wallet = await Wallet.deploy();

  await wallet.deployed();

  console.log("Wallet deployed to", wallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
