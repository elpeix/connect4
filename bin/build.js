#! /usr/bin/env node

const subProcess = require('child_process')
const {readFileSync, writeFileSync} = require('fs');

const dir = 'dist';
const jsFile = 'connect4.min.js';
const cssFile = 'connect4.min.css';
const jsInputFiles = [
  'Connect4.js',
  'Connect4View.js'
]

function clean() {
  if (dir.startsWith('/') || dir.indexOf('*') > -1) {
    throw new Error('Invalid directory');
  }
  execute(`rm -Rf ${dir}/`);
}

function prepareJs() {
  execute(`babel src -d ${dir}/js`);
  execute(`concat -o ${dir}/js/concat.js ${dir}/js/constants.js ${dir}/js/Board.js ${dir}/js/BoardValidator.js ${dir}/js/LineCounter.js ${dir}/js/Connect4.js ${dir}/js/Connect4View.js`);
  execute(`concat -o ${dir}/js/concat.js ${dir}/${jsInputFiles.join(' ')}`);
  encapsulate(`${dir}/js/concat.js`, `${dir}/js/concat.js`);
  execute(`uglifyjs -o ${dir}/js/${jsFile} ${dir}/js/concat.js`);
  execute(`mv ${dir}/js/${jsFile} ${dir}/${jsFile}`);
  execute(`rm -Rf ${dir}/js`);
}

function prepareCss() {
  execute(`mkdir -p ${dir}/css`);
  execute(`sass src/style.scss ${dir}/css/styles.css`);
  execute(`cleancss -o ${dir}/${cssFile} ${dir}/css/styles.css`);
  execute(`rm -Rf ${dir}/css`);
}

function encapsulate(input, output) {
  let content = readFileSync(input, 'utf-8');
  content = content.replace(/(\r\n|\n|\r)/gm, '');
  const result = `const Connect4=function($connect){${content};Connect4View($connect);};`;
  writeFileSync(output, result);
}

function execute(command) {
  subProcess.execSync(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`The stdout Buffer from shell: ${stdout.toString()}`);
      console.log(`The stderr Buffer from shell: ${stderr.toString()}`);
    }
  })
}

clean();
prepareJs();
prepareCss();