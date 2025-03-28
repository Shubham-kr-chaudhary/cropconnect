const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  // Retrieve the trusted forwarder address for gasless transactions.
  // Replace the default below with your actual trusted forwarder address.
  const trustedForwarder = m.getParameter("trustedForwarder", "0xYourTrustedForwarderAddress");

  // Pass both unlockTime and trustedForwarder to the Lock constructor.
  const lock = m.contract("Lock", [unlockTime, trustedForwarder], {
    value: lockedAmount,
  });

  return { lock };
});
