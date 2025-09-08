const express = require('express');
const cors = require('cors');
const { verifyToken, deprecated } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');

const router = express.Router();
router.use(cors);
router.use(deprecated);

/**
 * @swagger
 * /v1/token:
 *   post:
 *     summary: 토큰 발급 (v1)
 *     description: clientSecret을 이용해 JWT 토큰을 발급받습니다. (v1, deprecated 예정)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientSecret:
 *                 type: string
 *                 description: 발급받은 클라이언트 비밀키
 *     responses:
 *       200:
 *         description: 토큰 발급 성공
 *       401:
 *         description: 등록되지 않은 도메인
 */
router.post('/token', createToken);

/**
 * @swagger
 * /v1/test:
 *   get:
 *     summary: 토큰 검증 테스트 (v1)
 *     description: 헤더에 Authorization으로 토큰을 보내면, 토큰의 payload를 응답합니다.
 *     responses:
 *       200:
 *         description: 토큰이 유효할 경우 payload 반환
 *       401:
 *         description: 토큰 검증 실패
 */
router.get('/test', verifyToken, tokenTest);

/**
 * @swagger
 * /v1/posts/my:
 *   get:
 *     summary: 내 게시글 조회 (v1)
 *     description: JWT 토큰에서 해석된 userId로 사용자의 게시글을 가져옵니다.
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *       401:
 *         description: 인증 실패
 */
router.get('/posts/my', verifyToken, getMyPosts);

/**
 * @swagger
 * /v1/posts/hashtag/{title}:
 *   get:
 *     summary: 해시태그로 게시글 조회 (v1)
 *     description: 특정 해시태그가 포함된 게시글들을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색할 해시태그
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *       404:
 *         description: 해당 해시태그 없음
 */
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;
