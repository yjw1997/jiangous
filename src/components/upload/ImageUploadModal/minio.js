const Minio = require('minio')
const stream = require('stream')
import $C from '@/utils/config'
import { toBlob } from '@/utils/index'
import { parseTime } from '../../../utils'
const config = $C.minioConfig
export const minioUrl = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${config.endPoint}${config.port ? ':' + config.port : ''}/${config.bucketName}`
    // export const minioUrl = `https://${config.endPoint}${config.port ? ':' + config.port : ''}/${config.bucketName}`
    //连接minio文件服务器
export const minioClient = new Minio.Client(config)
    //上传文件
export function uploadMinIo(fileObj, prefix) {
    return new Promise((resolve, reject) => {
        if (fileObj) {
            let file = fileObj.raw || fileObj
                //判断是否选择了文件
            if (file == undefined) {
                //未选择
                console.log('请上传文件')
            } else {
                const uidGenerator = () => {
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random() * 16 | 0,
                                v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                    }
                    //选择
                    //获取文件类型及大小
                    //05_代表pc端
                let suffix = file.name.substring(file.name.lastIndexOf("."), file.name.length)
                let date = parseTime(new Date(), '{y}{m}{d}')
                const fileName = `${prefix}/${date}/${uidGenerator()}${suffix}`
                const mineType = file.type
                const fileSize = file.size

                //参数
                let metadata = {
                        'content-type': mineType,
                        'content-length': fileSize,
                    }
                    //判断储存桶是否存在
                minioClient.bucketExists(config.bucketName, function(err) {
                    if (err) {
                        if (err.code == 'NoSuchBucket') {
                            console.log('bucket does not exist.')
                            fileObj.status = 'error'
                            fileObj.response = {
                                status: 'error',
                                hash: fileObj.url,
                            }
                            return reject(err)
                        }
                    }
                    //存在
                    console.log('Bucket exists.')
                        //准备上传
                    let reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onloadend = function(e) {
                        const dataurl = e.target.result
                            //base64转blob
                        const blob = toBlob(dataurl)
                            //blob转arrayBuffer
                        let reader2 = new FileReader()
                        reader2.readAsArrayBuffer(blob)

                        reader2.onload = function(ex) {
                            //定义流
                            let bufferStream = new stream.PassThrough()
                                //将buffer写入
                            bufferStream.end(new Buffer(ex.target.result))
                                //上传
                            minioClient.putObject(config.bucketName, fileName, bufferStream, fileSize, metadata, function(err) {
                                console.log('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err)
                                console.log('%c [ fileName ]', 'font-size:13px; background:pink; color:#bf2c9f;', fileName)
                                if (err == null) {
                                    fileObj.status = 'success'
                                    fileObj.url = minioUrl + fileName
                                    fileObj.response = {
                                        status: 'success',
                                        hash: minioUrl + fileName,
                                    }
                                    return resolve(fileObj)
                                }
                                fileObj.status = 'error'
                                fileObj.response = {
                                    status: 'error',
                                    hash: fileObj.url,
                                }
                                return reject(err)
                            })
                        }
                    }
                })
            }
        }
    })

}