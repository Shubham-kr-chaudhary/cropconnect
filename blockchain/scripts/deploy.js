const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const CropConnect = await hre.ethers.deployContract("CropContract");

  // Wait for deployment
  await CropConnect.waitForDeployment();

  // Log deployed contract address
  console.log(`✅ CropConnect deployed to: ${await CropConnect.getAddress()}`);
}

// Run deployment script
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
