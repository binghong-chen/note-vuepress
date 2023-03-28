# 自己封装request死活上传不了formdata
```ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { getMD5 } from '../util/encrypt';
import { error, ok } from '../util/result';
import { urlencode } from '../util/url';
import { Transform as Stream } from 'stream';
import * as FormData from 'form-data';
import { Blob } from 'buffer';
import axios from 'axios';

const tokenPath = './baidu_token';
const clientId = 'tYZNP3udZU8B1lIabYT6Wtdh2Fq2cj9n';
const clientSecret = 'lK3q1gc86k19cb48TgkZB1MQ06Ph9piK';

interface AccessToken {
  expires_in: number;
  refresh_token: string;
  access_token: string;
  session_secret: string;
  session_key: string;
  scope: string;
  time?: string;
}

@Injectable()
export class BaiduService {
  token?: AccessToken;

  async auth(code: string) {
    try {
      const res = await this.ajax<AccessToken>(
        `https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=https://chenbinghong.top/baidu_auth`,
        {
          withoutToken: true,
        },
      );

      res.time = new Date().toString();
      this.token = res;
      fs.writeFileSync(tokenPath, JSON.stringify(res), { encoding: 'utf-8' });
      return ok('获取token成功');
    } catch (e) {
      console.log(e);
      return error(500, '获取token失败', e);
    }
  }

  async downloadFile(url: string) {
    const http = await import('http');
    const https = await import('https');
    const get = url.startsWith('https') ? https.get : http.get;

    let name = url.split('/').pop();
    if (name.includes('?')) {
      name = name.substring(0, name.indexOf('?'));
    }

    const data = await new Promise<Blob | Error>((resolve, reject) => {
      try {
        get(url, (resp) => {
          try {
            const type = resp.headers['content-type'];
            let ext = type?.split('/')?.pop();
            if (ext) {
              ext = `.${ext}`;
              if (!name.endsWith(ext)) name += ext;
            }

            const data = new Stream();
            resp.on('data', function (chunk) {
              data.push(chunk);
            });
            resp.on('end', function () {
              const buffer = data.read();
              const blob = new Blob([buffer], { type });
              resolve(blob);
            });
          } catch (e) {
            resolve(e);
          }
        });
      } catch (e) {
        resolve(e);
      }
    });

    if (data instanceof Error) {
      return error(500, '图片获取失败');
    }

    // 4M
    if (data.size > 4096 * 1024) {
      return error(500, '文件太大', data.size);
    }

    return ok('获取成功', {
      name,
      data,
    });
  }

  async upload(url: string, path: string) {
    // TODO 拦截器
    const checkRes = this.getToken();
    if (typeof checkRes !== 'string') return checkRes;

    const result = await this.downloadFile(url);
    if (!result.success) return result;

    const { data, name } = result.data;

    const size = data.size;

    path = `${path}/${name}`;
    const buffer = await data.arrayBuffer();
    const md5 = await getMD5(buffer);
    path = encodeURIComponent(path);
    // console.log({ buffer, md5, path });
    const res = await this.preUploadRequest(path, size, md5);
    const uploadid = res.uploadid;
    if (!uploadid) {
      return error(500, '预上传失败', res);
    }
    const res2 = await this.uploadRequest(data, name, path, uploadid);
    // console.log({ res2 });
    if (!res2.md5) {
      return error(500, '分片上传失败', res2);
    }
    // console.log({ md5, md5_res: res2.md5 });
    const res3 = await this.createRequest(path, size, uploadid, res2.md5);
    if (res3.errno === 0) return ok('上传成功');
    return error(res3.errno, '上传失败', res3);
  }

  getToken() {
    try {
      const authStr = fs.readFileSync(tokenPath, { encoding: 'utf-8' });
      if (!authStr) {
        return error(403, 'token为空');
      }
      this.token = JSON.parse(authStr);
      if (
        new Date().getTime() - new Date(this.token.time).getTime() >=
        (this.token.expires_in - 10) * 1000
      ) {
        return error(403, 'token过期');
      }
      return this.token.access_token;
    } catch (e) {
      return error(403, '获取token错误', e);
    }
  }

  async ajax<T>(
    url: string,
    options: {
      method?: string;
      headers?: any;
      data?: string | FormData;
      withoutToken?: boolean;
    } = { method: 'GET' },
  ): Promise<T> {
    const { method, data, headers, withoutToken } = options;

    // 暂时不实现 分片 图片大小应该不会超过  4M
    if (!withoutToken) url = `${url}&access_token=${this.token.access_token}`;

    console.log({ data, headers, url });

    const json = await axios({
      url,
      method,
      data,
      responseType: 'json',
    });
    // json.data;
    return json.data as T;

    // 就是上传不成功，axios就可以，fuck!!!
    // const json = await new Promise<T>(async (resolve, reject) => {
    //   const http = await import('http');
    //   const https = await import('https');
    //   const request = url.startsWith('https') ? https.request : http.request;
    //   const req = request(
    //     url,
    //     {
    //       method,
    //       headers,
    //     },
    //     async (res) => {
    //       let result = '';
    //       res.on('data', (chunk) => {
    //         result += chunk;
    //       });
    //       res.on('end', () => {
    //         resolve(JSON.parse(result) as T);
    //       });
    //     },
    //   );
    //   if (data instanceof FormData) {
    //     data.pipe(req);
    //   } else {
    //     if (data) req.write(data);
    //     req.end();
    //   }
    // });
    // return json;
  }
  // 目录列表
  async listdir(dir: string) {
    // TODO 拦截器
    const checkRes = this.getToken();
    if (typeof checkRes !== 'string') return checkRes;
    const res = await this.ajax<{ list?: any[] }>(
      `http://pan.baidu.com/rest/2.0/xpan/file?method=list&folder=1&dir=${dir}`,
    );
    return ok('目录列表获取成功', res);
  }

  // 预上传
  async preUploadRequest(path, size, md5) {
    return await this.ajax<{ uploadid?: string }>(
      `http://pan.baidu.com/rest/2.0/xpan/file?method=precreate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: urlencode({
          path,
          size,
          isdir: 0,
          block_list: JSON.stringify([md5]),
          autoinit: 1,
        }),
      },
    );
  }
  // 分片上传
  async uploadRequest(
    blob: Blob,
    name: string,
    path: string,
    uploadid: string,
  ) {
    const data = new FormData();
    data.append(
      'file',
      fs.createReadStream('./NPzLdr9qbgOS2TMbDAqDfwb5aALvDxFm.gif'),
      // {
      //   filename: name,
      //   contentType: blob.type,
      // },
    );
    // data.append('file', Buffer.from(await blob.arrayBuffer()), {
    //   filename: name,
    //   contentType: blob.type,
    // });

    // 暂时不实现 分片 图片大小应该不会超过  4M
    return await this.ajax<{ md5?: string }>(
      `https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?method=upload&type=tmpfile&path=${path}&uploadid=${uploadid}&partseq=0`,
      {
        method: 'POST',
        headers: {
          'Content-Length': blob.size,
          ...data.getHeaders(),
          'Accept-Encoding': 'gzip,deflate,br',
          Accept: '*/*',
          Connection: 'keep-alive',
          'Accept-Language': 'zh-CN, zh;q=0.9',
          Origin: 'chrome-extension://kiicfmonmhpkejjjhafeiolknoadigni',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        },
        data,
      },
    );
  }
  // 创建文件
  async createRequest(path, size, uploadid, md5) {
    return await this.ajax<{ errno?: number }>(
      `https://pan.baidu.com/rest/2.0/xpan/file?method=create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: urlencode({
          path,
          size,
          isdir: 0,
          block_list: JSON.stringify([md5]),
          uploadid,
          // rtype: 3,
          // zip_quality: 100,
        }),
      },
    );
  }
}
```

