const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

//cleanup
const compiledDir = path.resolve(__dirname, '../compiled');
fs.removeSync(compiledDir);
fs.ensureDirSync(compiledDir);

//compile
const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');
const result = solc.compile(contractSource, 1);

//check error
if(Array.isArray(result.errors) && result.errors.length) {
  throw new Error(result.errors[0]);
}

//save to disk
Object.keys(result.contracts).forEach(name => {
  const contractName = name.replace(':', '');
  const filePath = path.resolve(compiledDir, `${contractName}.json`);
  fs.outputJsonSync(filePath, result.contracts[name]);
  console.log(`Save compiled data ${contractName} to ${filePath})`);
})