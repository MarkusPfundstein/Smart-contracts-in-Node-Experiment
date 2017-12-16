const ProofOfExistence1 = artifacts.require('./ProofOfExistence1.sol');

module.exports = deployer => {
  deployer.deploy(ProofOfExistence1);
};
