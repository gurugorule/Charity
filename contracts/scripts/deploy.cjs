const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the CharityFund contract
  const CharityFund = await hre.ethers.getContractFactory("CharityFund");
  const charityFund = await CharityFund.deploy();

  await charityFund.waitForDeployment();

  const contractAddress = await charityFund.getAddress();
  console.log(`CharityFund deployed to ${contractAddress}`);

  // Get contract ABI
  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        "../artifacts/contracts/CharityFund.sol/CharityFund.json"
      ),
      "utf8"
    )
  );

  // Create contract data output
  const contractData = `
export const CONTRACT_ADDRESS = "${contractAddress}";
export const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};
`;

  // Create directory if it doesn't exist
  const contractsDir = path.join(__dirname, "../../src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Write contract data to file
  fs.writeFileSync(path.join(contractsDir, "CharityFund.ts"), contractData);
  console.log("Contract data saved to src/contracts/CharityFund.ts");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
