async function main() {
  console.log("Deploying CropContract...");

  // Retrieve the trusted forwarder address from environment variables.
  const trustedForwarder = process.env.TRUSTED_FORWARDER;
  if (!trustedForwarder) {
    throw new Error("TRUSTED_FORWARDER environment variable not set.");
  }

  // Deploy CropContract with the trusted forwarder.
  const cropContract = await ethers.deployContract("CropContract", [trustedForwarder]);
  await cropContract.waitForDeployment();
  console.log("CropContract deployed to:", await cropContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
