// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var path = require('path');
// const fs = require('fs');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function execute(command) {
	const exec = require('child_process').execSync
	//同步执行终端指令
	exec(command);
	// exec(command, (err, stdout, stderr) => {
	// 	vscode.window.showInformationMessage(stdout);
	// 	if (err){
	// 		vscode.window.showInformationMessage(stderr);
	// 	}	
	// })
}


//this is where to call javac, j2uml.jar, and plantuml.jar
function j2uml(uri){
	//vscode.window.showInformationMessage(''+uri);//uri就是我们右键选择的文件绝对路径
	//let command = 'mkdir'+' '+uri+'/../bin'+Math.round(Math.random());
	//vscode.window.showInformationMessage(command);
	//let folder = uri+'/../.j2uml'+Math.round(Math.random());
	//vscode.window.showInformationMessage(__filename)
	let currentFolder = uri.fsPath;//右键点击的文件/文件夹路径
	
	let folder = path.dirname(currentFolder)+'/.j2uml';
	//生成中间结果的文件夹路径(.j2uml)
	
	let j2uml_cd = 'cd '+currentFolder+';'
	
	/* create folder for  .class*/
	let creatFolder = 'mkdir '+folder;
	let createFolderBin = 'mkdir '+folder+'/bin'
	execute(creatFolder);
	execute(createFolderBin);

	/* find *.java to j2uml.txt */
	let findJava = j2uml_cd+'find . -name "*.java" > '+folder+'/j2uml.txt'
	execute(findJava);

	/* javac */
	let j2umlJavac = j2uml_cd+'javac @'+folder+'/j2uml.txt'+' -d '+folder+'/bin'
	execute(j2umlJavac);

	/* bin -(Soot)-> plantuml.txt: 
	 * java -jar j2uml.jar bin plantuml.txt 
	 */
	let j2uml_path = path.dirname(__filename);
	let j2uml_jar_path = j2uml_path+'/resources/j2uml.jar';
	//vscode.window.showInformationMessage(folder+'/bin');

	/*
	let cd_bin = 'cd '+folder+'/bin;'
	vscode.window.showInformationMessage(cd_bin+'ls');
	execute(cd_bin+'ls');
	*/
	let bin2plantuml = j2uml_cd+'java -jar '+j2uml_jar_path+' '+folder+'/bin '+folder+'/plantuml.txt';
	//vscode.window.showInformationMessage(bin2plantuml);
	execute(bin2plantuml);
	

	/* plantuml.txt -(plantuml.jar)-> plantuml.png
	 * java -jar plantuml.jar plantuml.txt -o "object path"
	 */
	let plantuml_jar_path = j2uml_path+'/resources/plantuml.jar';
	//vscode.window.showInformationMessage(plantuml_jar_path);
	let plantuml2png = 	j2uml_cd+'java -jar '+plantuml_jar_path+' '+ 
						folder+'/plantuml.txt'+' -o '+
						'\"'+path.dirname(currentFolder)+'\"';

	//vscode.window.showInformationMessage(plantuml2png);
	execute(plantuml2png);

	/* delete .j2uml */
	let delete_j2uml = 'rm -rf '+folder;
	//vscode.window.showInformationMessage(delete_j2uml);
	execute(delete_j2uml);
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "j2uml" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });
	// context.subscriptions.push(disposable);

	//TODO: j2uml is realized here
	let disposable = vscode.commands.registerCommand('extension.j2uml',  (uri) => {
		//openContextMenu(fileUri, false);

		//vscode.window.showInformationMessage(''+uri);
		//uri就是我们右键选择的文件绝对路径

		j2uml(uri);


    });
	context.subscriptions.push(disposable);
	
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
