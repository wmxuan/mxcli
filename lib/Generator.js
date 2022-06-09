import ora from 'ora';
import inquirer from 'inquirer';
import util from 'util';
import path from 'path';
import chalk from 'chalk';
import downloadGitRepo from 'download-git-repo';
import{getRepoList, getTagList }from './http.js';

async function wrapLoading(fn,message,...args){
  const spinner = ora(message);
  spinner.start();
  try{
    const result = await fn(...args);
    spinner.succeed('Successd!');
    return result;
  }catch(error){
    spinner.fail('request failed ,refetch...',error)
  }
}
class Generator {
  constructor (name, targetDir){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
     // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  // 获取用户选择的模版
  // 1）从远程拉去模版数据
  // 2）用户选择自己新下载的模版名称
  // 3）return 用户选择的名称
  async getRepo(){
    const repoList = await wrapLoading(getRepoList,'waiting fetch template...');
    if(!repoList)return;
    // 过滤我们需要的模版名称
    const repos = repoList.map(item=>item.name);
    // 用户选择自己新下载的模版名称
    const {repo}=await inquirer.prompt({
      name:'repo',
      type:'list',
      choices:repos,
      message:'Please choose a template to create project'
    })
    // return 用户选择的名称
    return repo;
  }
  //获取用户选择的版本
  // 1）基于repo的结果，远程拉拉取对应的tag列表
  // 2）用户选择自己需要下载的tag
  // 3）return 用户选择的tag
  async getTag(repo){
    // 1)基于repo结果，远程拉取对应的tag列表
    const tags = await wrapLoading(getTagList,'waiting fetch tag',repo);
    // 2)过滤需要的tag名称
    const tagsList = tags.map(item=>item.name);
    if(!tags)return;
    const { tag }= await inquirer.prompt({
      name:'tag',
      type:'list',
      choices:tagsList,
      message:'Place choose a tag to create project'
    })
    // 3）return用户选择的tag
    return tag;
  }

  // 核心创建逻辑
  // 1）获取模版名称
  // 2）获取tag名称
  // 3）下载模版到模版目录
  async create(){
    const repo = await this.getRepo();
    if(repo){
      console.log('用户选择了，repo='+repo);
      const tag =await this.getTag(repo);
      if(tag){
        console.log(`用户选择了repo=${repo},tag=${tag}`)
        await this.download(repo,tag);
         // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
      }else{
        console.log(`获取${repo}的tag失败`)
      }
    }else{
      console.log('获取repo失败')
    }
  }
  // 下载远程模版
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo,tag){
    // 1)拼接下载地址
    const requestURL = `zhurong-cli/${repo}${tag?'#'+tag:''}`;
    // 2)调用下载方法
    await wrapLoading(
      this.downloadGitRepo,//远程下载方法
      'waiting download template',//加载提示信息
      requestURL,//参数1:下载地址，
      path.resolve(process.cwd(),this.targetDir)//参数2:创建位置
    )
  }
}

export default Generator;