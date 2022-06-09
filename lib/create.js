
import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import Generator from './Generator.js';

export default async function (name, options) {
  // 执行创建命令

  // 当前命令行选择的目录
  const cwd  = process.cwd();
  // 需要创建的目录地址
  const targetAir  = path.join(cwd, name)
  console.log(targetAir,'需要创建的目录地址')

  // 如果目录已经存在
  if (fs.existsSync(targetAir)) {

    // 如果为强创建，则直接移除原来的目录，直接创建
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      //否则，询问用户是否需要覆盖
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },{
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }else{
    //如果目录不存在，则直接创建
    
  }

  // 创建项目
  const generator = new Generator(name, targetAir);

  // 开始创建项目
  generator.create()
}