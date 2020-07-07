# Server Điểm danh
Đây là server chạy trên Node.js để quản lý và lưu trữ thông tin người dùng, điểm danh.
## Yêu cầu
### MongoDB Community phiên bản 4.2.6 hoặc mới hơn.
### Node.js phiên bản 14.4.0 hoặc mới hơn.
### Thư viện Node.js gồm:
* express: Là web framework dùng để giao tiếp với yêu cầu HTTP từ ứng dụng.
* body-parser: Dùng để lấy thông tin từ yêu cầu của ứng dụng dưới dạng json.
* mongoose: Dùng để giao tiếp với cơ sở dữ liệu MongoDB.
* moment: Dùng để lấy thời gian và so sánh.
Cài đặt các thư viện trên bằng 
```
npm install express body-parser mongoose moment
```
## Chạy Server
 Tại file config.json, trường ```CLIENT_ID``` sẽ có giá trị OAuth 2.0 Client ID.
 Thực thi server bằng câu lệnh
```
node .\server.js
```
Khi chạy thành công sẽ hiển thị ```started at port 80```
