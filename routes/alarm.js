const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = 'ping_secret_key';

/* 🔐 auth 미들웨어 */
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰 없음' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: '토큰 오류' });
  }
}

/* 🔔 알람 생성 함수 (외부에서 호출용) */
function createAnswerAlarm(pinNo, answerNo, writerNo) {
  const sql = `
    SELECT p.user_no
    FROM pin_questions q
    JOIN pin_posts p ON q.post_no = p.post_no
    WHERE q.pin_no = ?
  `;

  db.query(sql, [pinNo], (err, rows) => {
    if (err || rows.length === 0) return;

    const ownerNo = rows[0].user_no;
    if (ownerNo === writerNo) return;

    db.query(
      `INSERT INTO pin_alarms (user_no, answer_no) VALUES (?, ?)`,
      [ownerNo, answerNo]
    );
  });
}

/* 🔔 알람 조회 */
router.get('/api/alarms', auth, (req, res) => {
  const { user_no } = req.user;

  const sql = `
    SELECT
      al.alarm_no,
      al.is_read,
      al.create_datetime,
      a.answer_content
    FROM pin_alarms al
    JOIN pin_answers a ON al.answer_no = a.answer_no
    WHERE al.user_no = ?
    ORDER BY al.create_datetime DESC
  `;

  db.query(sql, [user_no], (err, rows) => {
    if (err) return res.status(500).json({ message: '알람 조회 실패' });
    res.json(rows);
  });
});

/* 🔔 알람 읽음 처리 */
router.put('/api/alarms/:alarmNo/read', auth, (req, res) => {
  db.query(
    `UPDATE pin_alarms SET is_read = 1 WHERE alarm_no = ?`,
    [req.params.alarmNo],
    () => res.json({ success: true })
  );
});

module.exports = {
  router,
  createAnswerAlarm
};
