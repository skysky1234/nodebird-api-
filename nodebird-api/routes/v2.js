const express = require('express');
const { verifyToken, apiLimiter, dynamicApiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag, getMyFollowers } = require('../controllers/v2');

const router = express.Router();

router.use(corsWhenDomainMatches);

/**
 * @swagger
 * /v2/token:
 *   post:
 *     summary: 토큰 발급 (v2)
 *     description: clientSecret을 이용해 JWT 토큰을 발급받습니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientSecret
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
router.post('/token', apiLimiter, createToken);

/**
 * @swagger
 * /v2/test:
 *   get:
 *     summary: 토큰 검증 테스트 (v2)
 *     description: JWT 토큰을 Authorization 헤더에 담아 보내면 payload를 반환합니다.
 *     responses:
 *       200:
 *         description: 토큰 payload 반환
 *       401:
 *         description: 인증 실패
 */
router.get('/test', apiLimiter, verifyToken, tokenTest);

/**
 * @swagger
 * /v2/posts/my:
 *   get:
 *     summary: 내 게시글 조회 (v2)
 *     description: JWT 토큰에서 해석된 userId로 사용자의 게시글을 조회합니다.
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *       401:
 *         description: 인증 실패
 */
router.get('/posts/my', dynamicApiLimiter, verifyToken, getMyPosts);

/**
 * @swagger
 * /v2/Followers/my:
 *   get:
 *     summary: 내 팔로워 조회 (v2)
 *     description: JWT 토큰에서 해석된 userId로 사용자의 팔로워 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: 팔로워 목록 반환
 *       401:
 *         description: 인증 실패
 */
router.get('/Followers/my', dynamicApiLimiter, verifyToken, getMyFollowers);

/**
 * @swagger
 * /v2/posts/hashtag/{title}:
 *   get:
 *     summary: 해시태그로 게시글 조회 (v2)
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
router.get('/posts/hashtag/:title', apiLimiter, verifyToken, getPostsByHashtag);

module.exports = router;
