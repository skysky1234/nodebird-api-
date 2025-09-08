const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Domain } = require('../models');

const cors = require('cors');
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다',
    });
  }
};

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 5,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: '1분에 다섯 번만 요청할 수 있습니다.',
    });
  },
});

  exports.dynamicApiLimiter = async (req, res, next) => {
  try {
    // clientSecret으로 도메인 찾기 (JWT 검증 후 req.decoded에서도 가능)
    const domain = await Domain.findOne({ where: { clientSecret: req.body.clientSecret } });

    let max = 10; // 기본값: free
    if (domain && domain.type === 'premium') {
      max = 1000; // 프리미엄은 요청 많이 허용
    }

    return rateLimit({
      windowMs: 60 * 1000, // 1분
      max,
      handler(req, res) {
        res.status(this.statusCode).json({
          code: this.statusCode,
          message: `1분에 ${max}번만 요청할 수 있습니다.`,
        });
      },
    })(req, res, next);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: '서버 에러' });
  }
};
exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};

exports.corsWhenDomainMatches = async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host:new URL(req.get('origin')).host.replace(/^www\./, '') },
  });
    a=new URL(req.get('origin')).host.replace(/^www\./, '');
    console.log(`req.get(origin).host의값 ${new URL(req.get('origin')).host}`);
    console.log(`domain 값: ${domain}`);
    console.log(`origin 값: ${req.get('origin')}`);
  try{
   if (domain) {
      console.log("✅ 도메인 등록됨! CORS 적용 시작");
      cors({ 
        origin: req.get('origin'),
        credentials: true,
      })(req, res, next);
    } else { console.log("❌ 도메인 등록 안 됨! 다음 미들웨어 실행");
      next();
    }
    
  }
  catch (error) {
    console.error("🔥 CORS 미들웨어 오류:", error);
    next(error);
  }
}; 