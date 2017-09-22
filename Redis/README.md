### HTTP CACHING là gì ?   
#### Cache là gì
* Cache tên gọi là bộ nhớ đệm là nơi lưu trữ dữ liệu nằm chờ các ứng dụng hay phần cứng xử lý. Mục đích của nó là tăng tốc độ xử lý 
  * [https://vienit.org/cache-la-gi-cac-loai-cache-va-cach-xoa-trong-win-10/](https://vienit.org/cache-la-gi-cac-loai-cache-va-cach-xoa-trong-win-10/)
### Caching  
* Caching là kỹ thuật chuyển một bản copy các tài nguyên tĩnh phía Server xuống lưu dưới Client. Về cở bản người dùng cảm nhận thấy một độ trễ rất thấp khi yêu cầu các tài nguyên tĩnh từ phía server, lưu lượng truyền đi ít hơn, số request đến Server ít hơn, do vậy Server sẽ nhàn hơn để dùng sức của mình vào những việc khác.
![Caching](./caching.png)
* VD trên
1. Client yêu cầu file index.html
2. Server làm công việc đi tìm kiếm xem file index.html ở đâu
3. Server tìm thấy và trả về cho Client
4. Client download file và hiển thị cho người dùng.
* Giả sử index.html là một file tĩnh rất ít khi thay đổi thì điều bất cập xảy ra ở đây đó là mỗi lần Client yêu cầu truy cập file này, Server đều phải lục lọi tìm kiếm rồi bắt buộc Client phải download thì mới sử dụng được. Việc làm này đang làm lãng phí thời gian của Server và thời gian của người sử dụng.
#### Tại sao cần dùng Caching 
1. Giúp cho ứng dụng Web load nhanh hơn (giảm thời gian trễ).
2. Giảm băng thông sử dụng.
3. Giảm số lần truy cập lên Server.
#### Caching hoạt động như thế nào
[https://viblo.asia/p/http-caching-6BAMYknzvnjz](https://viblo.asia/p/http-caching-6BAMYknzvnjz)

# Redis Server
### Tại sao sử dụng Redis
1. Data model
* Khác với RDMS như MySQL, hay PostgreSQL, Redis không có table (bảng). Redis lưu trữ data dưới dạng key-value. Thực tế thì memcache cũng làm vậy, nhưng kiểu dữ liệu của memcache bị hạn chế, không đa dạng được như Redis, do đó không hỗ trợ được nhiều thao tác từ phía người dùng. Dưới đây là sơ lược về các kiểu dữ liệu Redis dùng để lưu value.

* STRING: Có thể là string, integer hoặc float. Redis có thể làm việc với cả string, từng phần của string, cũng như tăng/giảm giá trị của integer, float.
LIST: Danh sách liên kết của các strings. Redis hỗ trợ các thao tác push, pop từ cả 2 phía của list, trim dựa theo offset, đọc 1 hoặc nhiều items của list, tìm kiếm và xóa giá trị.
SET: Tập hợp các string (không được sắp xếp). Redis hỗ trợ các thao tác thêm, đọc, xóa từng phần tử, kiểm tra sự xuất hiện của phần tử trong tập hợp. Ngoài ra Redis còn hỗ trợ các phép toán tập hợp, gồm intersect/union/difference.
HASH: Lưu trữ hash table của các cặp key-value, trong đó key được sắp xếp ngẫu nhiên, không theo thứ tự nào cả. Redis hỗ trợ các thao tác thêm, đọc, xóa từng phần tử, cũng như đọc tất cả giá trị.
ZSET (sorted set): Là 1 danh sách, trong đó mỗi phần tử là map của 1 string (member) và 1 floating-point number (score), danh sách được sắp xếp theo score này. Redis hỗ trợ thao tác thêm, đọc, xóa từng phần tử, lấy ra các phần tử dựa theo range của score hoặc của string.
2. In-memory
  * Không như các DBMS khác lưu trữ dữ liệu trên đĩa cứng, Redis lưu trữ dữ liệu trên RAM, và đương nhiên là thao tác đọc/ghi trên RAM. Với người làm CNTT bình thường, ai cũng hiểu thao tác trên RAM nhanh hơn nhiều so với trên ổ cứng, nhưng chắc chắn chúng ta sẽ có cùng câu hỏi: Điều gì xảy ra với data của chúng ta khi server bị tắt?

  * Rõ ràng là toàn bộ dữ liệu trên RAM sẽ bị mất khi tắt server, vậy làm thế nào để Redis bảo toàn data và vẫn duy trì được ưu thế xử lý dữ liệu trên RAM. Chúng ta sẽ cùng tìm hiểu về cơ chế lưu dữ liệu trên ổ cứng của Redis trong phần tiếp theo của bài viết.
### Dowload
* dowload redis 
[dowload link tại đây](https://redis.io/download)
* Dowload redis-server, redis-cli để kiểm tra trên terminal
```js
    const redis = require('promise-redis')

    const client = redis.createcreateClient()

    // Check kết nối
    client.on('connect', () => {
        console.log('connected')
```

### Cách sử dụng
#### Redis hỗ trợ nhiều kiểu dữ liệu khác nhau, đơn giản dùng kiểu string, hashes. Một vấn đề quan trọng cần tìm hiểu pub/sub 
* Trước khi vào database để lấy dữ liệu --> kiểm tra trong cache đã có data chưa
* Kiểu String 
  *  get, set --> set, get key
  * Mset, Mget --> set và get nhiều key 
[xem thêm tại đây] (https://redis.io/commands/mget)
```js
    client.get('data')
    .then(data => {
        if(data) {
            res.json(data)
        }else{
            db.any('SELECT * FROM user WHERE id = $1')
            .then(result => {
                 client.set('data', result)
            })
        }
    })

```
* Kiểu Hashes tương tự map trong ES6 dưới dang 1 key và 1 map chưa key-value
[xem thêm tại đây] (https://redis.io/commands#hash)

###
[Example về redis](https://github.com/bradtraversy/redusers/blob/master/app.js)

