# RSA加密

1. 选择两个大的素数p, q p!=q, N=pq
2. r=(p-1)(q-1)
3. 选择e (e < r),e 和 r 互质。求e关于r的逆元d(ed ===1 mod r)（模逆元存在，当且仅当e与r互质)
4. 将p和q销毁
5. 公钥(N,e)，私钥(N,d)

## 加密

输入：m

1. 将m转成小于e的非负整数n（可以转Unicode码，然后几个Unicode一段组成n）
2. c=n^e mod N

解密

输入：c

1. n=c^d mod N
2. 用n重新编码得到m