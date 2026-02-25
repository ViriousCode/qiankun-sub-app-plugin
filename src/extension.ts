import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createQiankunSubApp', async (uri: vscode.Uri) => {
        console.log('👉 [Debug] 触发命令，收到的 uri:', uri?.fsPath);

        let targetFolder = uri?.fsPath;
        if (!targetFolder) {
            vscode.window.showErrorMessage('请在资源管理器中右键点击文件夹来使用此功能！');
            return;
        }

        // 1. 获取用户输入的子应用名称
        const appName = await vscode.window.showInputBox({
            prompt: '请输入 qiankun 子应用的名称 (英文，将作为目录名和 App ID)',
            placeHolder: '例如: sub-app-order',
            validateInput: (text) => {
                return text.trim() === '' ? '名称不能为空！' : null;
            }
        });

        if (!appName) { 
            console.log('👉 [Debug] 用户取消了输入');
            return; 
        } 

        const targetAppPath = path.join(targetFolder, appName);
        console.log('👉 [Debug] 准备生成的目标路径:', targetAppPath);

        if (fs.existsSync(targetAppPath)) {
            vscode.window.showErrorMessage(`文件夹 ${appName} 已存在！`);
            return;
        }

        try {
            const templateDir = path.join(context.extensionPath, 'templates', 'sub-app-template');
            console.log('👉 [Debug] 正在寻找的模板路径:', templateDir);

            if (!fs.existsSync(templateDir)) {
                throw new Error(`找不到模板文件夹！请检查你的插件工程里是否有这个目录：${templateDir}`);
            }

            // 2. 拷贝文件夹（带黑名单过滤，防止把 node_modules 拷过去导致卡死）
            fs.cpSync(templateDir, targetAppPath, { 
                recursive: true,
                filter: (src) => {
                    const fileName = path.basename(src);
                    const ignoreList = ['node_modules', '.git', 'dist', '.idea', '.vscode-test', '.DS_Store'];
                    
                    if (ignoreList.includes(fileName)) {
                        console.log(`👉 [Debug] 自动跳过忽略的文件夹/文件: ${fileName}`);
                        return false; 
                    }
                    return true; 
                }
            });
            console.log('👉 [Debug] 文件夹拷贝成功');

            // 3. 递归扫描并替换所有文件中的 {{APP_NAME}} 变量
            replacePlaceholdersInDir(targetAppPath, appName);
            console.log('👉 [Debug] 变量替换完成');

            vscode.window.showInformationMessage(`✅ 模板已生成：qiankun 子应用 ${appName} 创建成功！`);
            
            // 4. 生成完毕后，自动在编辑器中打开入口文件 (如果有的话)
            const mainTsUri = vscode.Uri.file(path.join(targetAppPath, 'src', 'main.ts'));
            if (fs.existsSync(mainTsUri.fsPath)) {
                vscode.window.showTextDocument(mainTsUri);
            }

        } catch (error: any) {
            console.error('❌ [Error] 捕获到异常:', error);
            vscode.window.showErrorMessage(`创建失败: ${error?.message || error}`);
        }
    });

    context.subscriptions.push(disposable);
}

// ==============================================================================
// 核心辅助函数：递归遍历文件夹，替换指定文件类型中的 {{APP_NAME}} 占位符
// ==============================================================================
function replacePlaceholdersInDir(dirPath: string, appName: string) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // 如果是文件夹，继续往深处递归查找
            replacePlaceholdersInDir(fullPath, appName);
        } else {
            // 如果是文件，判断后缀名是不是我们需要处理的代码/配置文件
            const ext = path.extname(fullPath);
            // 涵盖前端常见的文本文件类型，避免去读取图片或字体等二进制文件报错
            const allowedExts = ['.ts', '.js', '.vue', '.html', '.json', '.md', '.css', '.scss', '.sass'];
            
            // 允许替换指定后缀的文件，或者像 .env 这种没有后缀名的环境文件
            if (allowedExts.includes(ext) || file.startsWith('.env') || file === '.gitignore') {
                let content = fs.readFileSync(fullPath, 'utf-8');
                // 只要文件内容里包含占位符，就执行替换并保存
                if (content.includes('{{APP_NAME}}')) {
                    content = content.replace(/\{\{APP_NAME\}\}/g, appName);
                    fs.writeFileSync(fullPath, content, 'utf-8');
                    console.log(`👉 [Debug] 已替换文件变量: ${fullPath}`);
                }
            }
        }
    });
}

export function deactivate() {}