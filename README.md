
### 项目名称

    测试demo

### 安装


```bash 
#添加配置文件.env  修改 PRIVATE_KEY
$ cp env.demo .env

$ npm install
  
# 初始化 relayer 配置文件 读取relayer.csv中的数据更新配置
$ npm run init-relayer-config

# 管理员分发ap，读取data.csv中的数据分发
$ npm run distribute


# 管理员解锁，
$ npm run unlock
```