const ProofOfExistence1 = artifacts.require('./ProofOfExistence1.sol');
const Debit = artifacts.require('./Debit.sol');

module.exports = deployer => {
  deployer.deploy(ProofOfExistence1);
  deployer.deploy(Debit);
};
