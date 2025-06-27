const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더
app.use(cors()); // CORS 설정
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 최대 100개 요청
});
app.use(limiter);

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let users = [
  // 권한 A (최고)
  { phone: '010-1111-0001', password: 'pwA1', name: '관리자A', email: 'adminA@example.com', role: 'A', createdAt: new Date() },
  // 권한 B
  { phone: '010-2222-0002', password: 'pwB1', name: '매니저B', email: 'managerB@example.com', role: 'B', createdAt: new Date() },
  // 권한 C
  { phone: '010-3333-0003', password: 'pwC1', name: '직원C', email: 'staffC@example.com', role: 'C', createdAt: new Date() },
  // 권한 D
  { phone: '010-4444-0004', password: 'pwD1', name: '외주D', email: 'partnerD@example.com', role: 'D', createdAt: new Date() },
  // 권한 E (최하)
  { phone: '010-5555-0005', password: 'pwE1', name: '게스트E', email: 'guestE@example.com', role: 'E', createdAt: new Date() }
];

let posts = [
  { id: 1, title: '첫 번째 포스트', content: '내용입니다', userId: 1, createdAt: new Date() },
  { id: 2, title: '두 번째 포스트', content: '두 번째 내용', userId: 2, createdAt: new Date() }
];

// 유틸리티 함수
const findUserByPhone = (phone) => users.find(user => user.phone === phone);
const findPostById = (id) => posts.find(post => post.id === parseInt(id));
const generateId = (array) => Math.max(...array.map(item => item.id), 0) + 1;

// 에러 핸들링 미들웨어
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '유효성 검사 실패',
      errors: errors.array()
    });
  }
  next();
};

// ===== 사용자 API =====

// 모든 사용자 조회
app.get('/api/users', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.length / limit),
        totalUsers: users.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 특정 사용자 조회
app.get('/api/users/:phone', (req, res) => {
  try {
    const user = findUserByPhone(req.params.phone);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 새 사용자 생성
app.post('/api/users', [
  body('name').trim().isLength({ min: 2 }).withMessage('이름은 최소 2글자 이상이어야 합니다'),
  body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요')
], handleValidationErrors, (req, res) => {
  try {
    const { name, email } = req.body;
    
    // 이메일 중복 확인
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '이미 존재하는 이메일입니다'
      });
    }
    
    const newUser = {
      id: generateId(users),
      name,
      email,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: '사용자가 성공적으로 생성되었습니다',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 사용자 정보 수정
app.put('/api/users/:phone', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('이름은 최소 2글자 이상이어야 합니다'),
  body('email').optional().isEmail().withMessage('유효한 이메일 주소를 입력해주세요')
], handleValidationErrors, (req, res) => {
  try {
    const phone = req.params.phone;
    const userIndex = users.findIndex(user => user.phone === phone);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다'
      });
    }
    
    const { name, email } = req.body;
    
    // 이메일 중복 확인 (자신 제외)
    if (email) {
      const existingUser = users.find(user => user.email === email && user.phone !== phone);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: '이미 존재하는 이메일입니다'
        });
      }
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      message: '사용자 정보가 성공적으로 수정되었습니다',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 사용자 삭제
app.delete('/api/users/:phone', (req, res) => {
  try {
    const phone = req.params.phone;
    const userIndex = users.findIndex(user => user.phone === phone);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다'
      });
    }
    
    // 해당 사용자의 포스트도 함께 삭제
    posts = posts.filter(post => post.userId !== phone);
    users.splice(userIndex, 1);
    
    res.json({
      success: true,
      message: '사용자가 성공적으로 삭제되었습니다'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// ===== 포스트 API =====

// 모든 포스트 조회
app.get('/api/posts', (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    
    let filteredPosts = posts;
    if (userId) {
      filteredPosts = posts.filter(post => post.userId === userId);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // 작성자 정보 포함
    const postsWithAuthor = paginatedPosts.map(post => ({
      ...post,
      author: findUserByPhone(post.userId)
    }));
    
    res.json({
      success: true,
      data: postsWithAuthor,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 특정 포스트 조회
app.get('/api/posts/:id', (req, res) => {
  try {
    const post = findPostById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '포스트를 찾을 수 없습니다'
      });
    }
    
    const postWithAuthor = {
      ...post,
      author: findUserByPhone(post.userId)
    };
    
    res.json({
      success: true,
      data: postWithAuthor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 새 포스트 생성
app.post('/api/posts', [
  body('title').trim().isLength({ min: 1 }).withMessage('제목은 필수입니다'),
  body('content').trim().isLength({ min: 1 }).withMessage('내용은 필수입니다'),
  body('userId').isInt({ min: 1 }).withMessage('유효한 사용자 ID가 필요합니다')
], handleValidationErrors, (req, res) => {
  try {
    const { title, content, userId } = req.body;
    
    // 사용자 존재 확인
    if (!findUserByPhone(userId)) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 사용자입니다'
      });
    }
    
    const newPost = {
      id: generateId(posts),
      title,
      content,
      userId: parseInt(userId),
      createdAt: new Date()
    };
    
    posts.push(newPost);
    
    res.status(201).json({
      success: true,
      message: '포스트가 성공적으로 생성되었습니다',
      data: {
        ...newPost,
        author: findUserByPhone(userId)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 포스트 수정
app.put('/api/posts/:id', [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('제목은 비어있을 수 없습니다'),
  body('content').optional().trim().isLength({ min: 1 }).withMessage('내용은 비어있을 수 없습니다')
], handleValidationErrors, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '포스트를 찾을 수 없습니다'
      });
    }
    
    const { title, content } = req.body;
    
    posts[postIndex] = {
      ...posts[postIndex],
      ...(title && { title }),
      ...(content && { content }),
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      message: '포스트가 성공적으로 수정되었습니다',
      data: {
        ...posts[postIndex],
        author: findUserByPhone(posts[postIndex].userId)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// 포스트 삭제
app.delete('/api/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '포스트를 찾을 수 없습니다'
      });
    }
    
    posts.splice(postIndex, 1);
    
    res.json({
      success: true,
      message: '포스트가 성공적으로 삭제되었습니다'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// ===== 통계 API =====
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalUsers: users.length,
      totalPosts: posts.length,
      postsPerUser: users.map(user => ({
        userId: user.phone,
        userName: user.name,
        postCount: posts.filter(post => post.userId === user.phone).length
      }))
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다'
    });
  }
});

// ===== 헬스 체크 =====
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다'
  });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '서버 내부 오류가 발생했습니다'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API 문서: http://localhost:${PORT}/api/users`);
});