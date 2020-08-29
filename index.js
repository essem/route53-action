const core = require("@actions/core");
const fs = require("fs");
const tmp = require("tmp");
const childProcess = require("child_process");

const hostedZoneId = core.getInput("hosted-zone-id");
const action = core.getInput("action");
const name = core.getInput("name");
const ip = core.getInput("ip");

const content = {
  Comment: "CREATE a record ",
  Changes: [
    {
      Action: action,
      ResourceRecordSet: {
        Name: name,
        Type: "A",
        TTL: 300,
        ResourceRecords: [{ Value: ip }],
      },
    },
  ],
};
const contentJson = JSON.stringify(content);
console.log(contentJson);

const file = tmp.fileSync();
console.log(`File: ${file.name}`);
fs.writeFileSync(file.name, contentJson);

const command = `aws route53 change-resource-record-sets --hosted-zone-id ${hostedZoneId} --change-batch file://${file.name}`;
console.log(`Command: ${command}`);

try {
  const output = childProcess.execSync(command);
  console.log(output.toString());
} catch (err) {
  console.log(`error: ${err.toString()}`);
}
