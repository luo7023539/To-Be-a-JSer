## Git origin and master

### 对Git的操作主要围绕三个步骤展开

* 拉取代码
* 改动代码
* 同步代码

这其中会涉及到两个repository

一个是 remote repository - 位于远程服务器

另一个是 local repository - 位于本地

第一、第三个步骤涉及 remote server/ remote repository/ remote branch

第二个涉及 local repository / local branch

git clone 命令会根据指定的 remote server/ remote repository/ remote branch 拷贝副本到本地

在克隆完成后,Git会自动将此远程仓库命名位origin

运行git remote -v 可以看到 origin的含义

并创建一个指向它的master的指针

我们使用 远程仓库名/分支名 这样的形式表示远程分支

origin/master 指向一个 remote branch

同时Git会建立一个属于自己的本地master分支

指向刚刚克隆的本地副本

通过 add commit merge 来移动master指向