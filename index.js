const core = require("@actions/core");
const fs = require("fs");
const tmp = require("tmp");
const childProcess = require("child_process");

const hostedZoneId = core.getInput("hosted-zone-id");
const comment = core.getInput("comment");
const action = core.getInput("action");
const resourceRecordSet = core.getInput("resource-record-set");

const content = {
  Comment: comment,
  Changes: [
    {
      Action: action,
      ResourceRecordSet: JSON.parse(resourceRecordSet),
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
