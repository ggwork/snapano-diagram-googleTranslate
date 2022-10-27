## 说明

本项目有2个功能
1.采用google翻译api，批量翻译data文件夹下的所有文件，翻译的结果存放在translateResult文件夹下
2.作为静态服务器，显示translateResult下的所有文件

## google翻译使用方法

1.本项目需要部署在外网的服务器上，比如香港云服务器，在大陆服务器上运行是不会成功的

2.调用google翻译api前，请将google-api-key.json添加到服务器的环境变量中

linux 服务器设置如下
```shell
export GOOGLE_APPLICATION_CREDENTIALS="KEY_PATH"
```
例如：
```shell
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```

参考：[google翻译设置](https://cloud.google.com/translate/docs/setup)

3.调用 

```shell
node ./translateFile.js
```
or
```shell
npm run translateFile
```

## 静态服务器使用方法

```shell
npm run start
```
