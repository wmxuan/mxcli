#! /usr/bin/env node
import {program} from 'commander';//用于命令行自定义指令
import chalk from 'chalk';//
import fs from 'fs-extra';
import path from 'path';
import figlet from 'figlet';
import create from '../lib/create.js';
const __dirname = path.resolve();
program.command('create <app-name>')//定义命令和参数
				.description('create a new object')//添加描述
				// .option('-f,--force','overwrite target directory if it exist',false)//-f or --force 为强制创建，如果创建的目录存在则直接覆盖
				.option('-f,--force','overwrite target directory if it exist')//-f or --force 为强制创建，如果创建的目录存在则直接覆盖
				.action((name,options)=>{
				console.log('name:',name,'options:',options,'create命令结果')//打印执行结果
				   // 在 create.js 中执行创建任务
    		create(name, options)
				})
        fs.readFile(`${__dirname}/package.json`,'utf-8', function(err,data){
					if(err){
					  console.log(err);
					}else{
					  // console.log(data);
						program.version(`v${data.version}`)//配置版本号信息
						.usage('<command> [option]')
					}
				 })
program
  // 监听 --help 执行
  .on('--help', () => {
    // 新增说明信息
    // console.log(`\r\nRun ${chalk.cyan(`mxcli <command> --help`)} for detailed usage of given command\r\n`)
  })
program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('mxcli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
  })
program.parse(process.argv);//解析用户执行命令传入参数，该语句必须在最后一行