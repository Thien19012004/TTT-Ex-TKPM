# STUDENT MANAGEMENT

Đây là một ứng dụng bao gồm cả backend và frontend, được xây dựng để phục vụ mục đích quản lý sinh viên đơn giản.

## Cấu trúc source code

Dự án được tổ chức thành hai thư mục chính:
```bash
├── backend/                  # Thư mục chứa mã nguồn backend
│   ├── package.json          # File cấu hình dependencies cho backend
│   ├── server.js             # File chính để khởi chạy server backend
│   
│     
│
├── frontend/                 # Thư mục chứa mã nguồn frontend
│   ├── public/              
│   ├── src/                  # Thư mục chứa mã nguồn React
│   │   ├── components/       # Thư mục chứa các components
│   │   │   ├── StudentForm.js
│   │   │   ├── StudentList.js
│   │   │   └── StudentSearch.js
│   │   ├── App.js            # Component chính của ứng dụng
│   │   ├── index.js          # File khởi chạy ứng dụng React
│   │   └── db.js             # File quản lý IndexedDB
│   ├── package.json          # File cấu hình dependencies cho frontend
│   └── package-lock.json     # File chi tiết các dependencies
│
└── README.md                 # File hướng dẫn dự án
```
## Hướng dẫn cài đặt & chạy chương trình

### Yêu cầu
- Node.js và npm đã được cài đặt trên máy của bạn.
- Một trình quản lý gói (như npm hoặc yarn).

### Các bước cài đặt
1.  **Clone Repository:**
    Tạo một thư mục để chứa code, sau đó sử dụng cmd để chạy lệnh sau:
    ```bash
    git clone https://github.com/Thien19012004/TTT-Ex-TKPM.git
    ```

2.  **Cài Đặt Dependencies cho backend:**

    ```bash
    cd backend
    npm install
    ```
3. **Cài đặt Dependencies cho frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
### Chạy Docker để khởi động logstash , kibana , elastic search
1.  docker-compose up -d

### Chạy ứng dụng.
1.  **Chạy backend:**
    ```bash
    node server.js
    ```
2. **Chạy frontend:**
    ```bash
    npm start
    ```

Ứng dụng sẽ chạy tại `http://localhost:3000` 
Server sẽ chạy tại `http://localhost:5002`

