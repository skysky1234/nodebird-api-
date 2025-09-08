const express = require('express');
const { renderLogin, createDomain } = require('../controllers');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: 로그인 페이지 렌더링
 *     description: 로그인 화면 또는 로그인된 사용자의 도메인 관리 화면을 렌더링합니다.
 *     responses:
 *       200:
 *         description: HTML 페이지 반환 (로그인 화면 또는 도메인 목록 포함)
 */
router.get('/', renderLogin);

/**
 * @swagger
 * /domain:
 *   post:
 *     summary: 도메인 등록
 *     description: 로그인된 사용자가 새로운 도메인을 등록합니다. 등록 시 클라이언트 비밀키(clientSecret)가 자동 생성됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - host
 *               - type
 *             properties:
 *               host:
 *                 type: string
 *                 example: example.com
 *                 description: 등록할 도메인 주소
 *               type:
 *                 type: string
 *                 enum: [free, premium]
 *                 example: free
 *                 description: 도메인 타입 (무료/프리미엄)
 *     responses:
 *       302:
 *         description: 등록 성공 시 /로 리다이렉트
 *       401:
 *         description: 로그인하지 않은 경우
 */
router.post('/domain', isLoggedIn, createDomain);

module.exports = router;
