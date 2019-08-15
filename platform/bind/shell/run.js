const { exec } = require('child_process');

module.exports = credentials => {
  let proc = exec(`ttyd ` +
        `-t cursorStyle="underline" `+
        `-t cursorBlink=true ` +
        `-t theme=black ` +
        `-c ${credentials} bash`);

  process.on('exit', () => {
    proc.kill();
  });

  return proc;
};
