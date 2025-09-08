const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/join:
 *   post:
 *     summary: 회원가입
 *     description: 이메일, 닉네임, 비밀번호로 새로운 사용자를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nick
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               nick:
 *                 type: string
 *                 example: 홍길동
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       302:
 *         description: 회원가입 성공 시 /로 리다이렉트
 *       400:
 *         description: 이미 존재하는 이메일
 */
router.post('/join', isNotLoggedIn, join); 

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     description: 이메일과 비밀번호로 로그인합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       302:
 *         description: 로그인 성공 시 /로 리다이렉트
 *       401:
 *         description: 로그인 실패
 */
router.post('/login', isNotLoggedIn, login);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: 로그아웃
 *     description: 현재 로그인된 세션을 종료합니다.
 *     responses:
 *       302:
 *         description: 로그아웃 성공 시 /로 리다이렉트
 */
router.get('/logout', isLoggedIn, logout);

/**
 * @swagger
 * /auth/kakao:
 *   get:
 *     summary: 카카오 로그인 요청
 *     description: 카카오 로그인 페이지로 이동합니다.
 *     responses:
 *       302:
 *         description: 카카오 인증 페이지로 리다이렉트
 */
router.get('/kakao', passport.authenticate('kakao'));

/**
 * @swagger
 * /auth/kakao/callback:
 *   get:
 *     summary: 카카오 로그인 콜백
 *     description: 카카오 인증 후 콜백을 받아 로그인 처리합니다.
 *     responses:
 *       302:
 *         description: 성공 시 /로 리다이렉트, 실패 시 /?error=카카오로그인 실패
 */
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/'); // 성공 시에는 /로 이동
});

module.exports = router;
