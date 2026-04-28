const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
// const db = require("./db");

//routes
const authRoutes = require("./routes/auth"); // 로그인/회원가입 같은 auth
const usersRoutes = require("./routes/users"); //프로필/아바타 업로드 포함
const mypageRoutes = require("./routes/mypage"); // ✅ 마이디자인 목록 등
const uploadRoutes = require("./routes/upload"); // 게시물 + 이미지 업로드
const pinRoutes = require("./routes/pins");      // 핀 저장
const designRoutes = require("./routes/designs");// 공용 detail
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/posts");
const answerRoutes = require('./routes/answer'); //핀 답변 
const feedbackRoutes = require("./routes/feedback");  // ✅ 피드백 조회
const adminRoutes = require("./routes/admin");   // 어드민 라우터

const qnaRoutes = require("./routes/qna"); //질문과 답변 질문 등록

const adminCategoriesRoutes = require("./routes/adminCategories");  // 관리자 문제 유형


const app = express();
// const PORT = 9070;
const PORT = process.env.PORT || 9070;

// 미들웨어(가장 위)
app.use(cors());
app.use(express.json());
// 마이프로필 유저 라우터 연결
app.use(express.urlencoded({ extended: true }));

//업로드 이미지 접근 허용
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우터
app.use('/api/auth', authRoutes); //회원관련
app.use('/api/users', usersRoutes);// 예: /users/me, /users/profile, /users/profile/avatar
app.use('/api/mypage', mypageRoutes);
app.use('/api/posts', uploadRoutes); //업로드 관련
app.use('/api/pins', pinRoutes); //핀에디터 관련
app.use('/api/designs', designRoutes); //디테일 페이지 관련
app.use('/api/categories', categoryRoutes);
app.use("/api/feedback", feedbackRoutes);  // ✅ 피드백 조회
app.use("/admin", adminRoutes);

app.use("/qna", qnaRoutes) //질문과 답변

app.use("/admin/categories", adminCategoriesRoutes); //어드민 카테고리라우터


app.use(postRoutes);// 게시물 관련
app.use(answerRoutes);//핀 질문당 댓글 관련

// 서버 상태 확인용
app.get('/', (req, res) => {
  res.send('Ping backend running');
});

// 서버 실행시 
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);

});

