const RentalContract = artifacts.require("../contracts/RentalContract.sol");

module.exports = async function (deployer) {
  await deployer.deploy(RentalContract);
};
