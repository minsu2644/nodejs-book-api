const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// Render 환경 변수(PORT)를 사용하거나, 없으면 로컬에서 3000을 사용
const port = process.env.PORT || 3000; 

// 미들웨어 설정
// JSON 형식의 요청 본문(Body)을 파싱하기 위해 사용
app.use(bodyParser.json()); 
// CORS 문제를 피하기 위해 모든 출처 허용 (개발 환경에서만 사용 권장)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// --- 가상 데이터베이스 (메모리) ---
let books = [
    { id: 1, title: 'Node.js 교과서', author: '제로초', year: 2020 },
    { id: 2, title: '리액트를 다루는 기술', author: '김민준', year: 2021 }
];
let nextId = 3; 

// ------------------------------------
// --- API 라우팅 (CRUD) ---
// ------------------------------------

// [R] 전체 도서 조회 (GET /api/books)
app.get('/api/books', (req, res) => {
    res.json(books);
});

// [R] 특정 도서 조회 (GET /api/books/:id)
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(b => b.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send({ message: '도서를 찾을 수 없습니다.' });
    }
});

// [C] 새로운 도서 생성 (POST /api/books)
app.post('/api/books', (req, res) => {
    const newBook = req.body;
    if (!newBook.title || !newBook.author) {
        return res.status(400).send({ message: '제목과 저자는 필수 입력 항목입니다.' });
    }
    const book = { id: nextId++, title: newBook.title, author: newBook.author, year: newBook.year || null };
    books.push(book);
    res.status(201).json(book);
});

// [U] 도서 정보 수정 (PUT /api/books/:id)
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const index = books.findIndex(b => b.id === id);

    if (index !== -1) {
        books[index] = { ...books[index], ...updateData, id: id };
        res.json(books[index]);
    } else {
        res.status(404).send({ message: '도서를 찾을 수 없습니다.' });
    }
});

// [D] 도서 삭제 (DELETE /api/books/:id)
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    books = books.filter(b => b.id !== id);

    if (books.length < initialLength) {
        res.status(204).send(); // No Content, 성공적으로 삭제됨
    } else {
        res.status(404).send({ message: '도서를 찾을 수 없습니다.' });
    }
});

// --- 서버 실행 ---
app.listen(port, () => {
    console.log(`도서 관리 API 서버가 포트 ${port} 에서 실행 중입니다.`);
});