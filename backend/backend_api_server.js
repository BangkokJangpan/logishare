const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, '../shared_logistics.db'));

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

// ===== 회사(companies) 샘플 데이터 및 API =====
// let companies = [ ... ]; // 기존 메모리 배열 주석 처리

// ===== companies DB 연동 API (DB 컬럼명 기준) =====
app.get('/api/companies', (req, res) => {
  db.all('SELECT * FROM companies', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});
app.post('/api/companies', (req, res) => {
  const { company_name, business_number, phone, email, address, company_type, status } = req.body;
  const sql = `INSERT INTO companies (company_name, business_number, phone, email, address, company_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [company_name, business_number, phone, email, address, company_type, status];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 등록 오류', error: err.message });
    }
    db.get('SELECT * FROM companies WHERE company_id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});
app.put('/api/companies/:id', (req, res) => {
  const { company_name, business_number, phone, email, address, company_type, status } = req.body;
  const sql = `UPDATE companies SET company_name=?, business_number=?, phone=?, email=?, address=?, company_type=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE company_id=?`;
  const params = [company_name, business_number, phone, email, address, company_type, status, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 수정 오류', error: err.message });
    }
    db.get('SELECT * FROM companies WHERE company_id = ?', [req.params.id], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});
app.delete('/api/companies/:id', (req, res) => {
  db.run('DELETE FROM companies WHERE company_id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 삭제 오류', error: err.message });
    }
    res.json({ success: true, message: '회사 삭제 완료' });
  });
});

// ===== vehicles 샘플 데이터 및 API =====
// let vehicles = [ ... ]; // 기존 메모리 배열 주석 처리

// 차량 목록 조회
app.get('/api/vehicles', (req, res) => {
  db.all('SELECT * FROM vehicles', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// 차량 등록
app.post('/api/vehicles', (req, res) => {
  const { company_id, license_plate, vehicle_type, max_weight, max_volume, driver_id, status, current_location_lat, current_location_lng } = req.body;
  const sql = `INSERT INTO vehicles (company_id, license_plate, vehicle_type, max_weight, max_volume, driver_id, status, current_location_lat, current_location_lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [company_id, license_plate, vehicle_type, max_weight, max_volume, driver_id, status, current_location_lat, current_location_lng];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 등록 오류', error: err.message });
    }
    db.get('SELECT * FROM vehicles WHERE vehicle_id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});

// 차량 수정
app.put('/api/vehicles/:id', (req, res) => {
  const { company_id, license_plate, vehicle_type, max_weight, max_volume, driver_id, status, current_location_lat, current_location_lng } = req.body;
  const sql = `UPDATE vehicles SET company_id=?, license_plate=?, vehicle_type=?, max_weight=?, max_volume=?, driver_id=?, status=?, current_location_lat=?, current_location_lng=?, updated_at=CURRENT_TIMESTAMP WHERE vehicle_id=?`;
  const params = [company_id, license_plate, vehicle_type, max_weight, max_volume, driver_id, status, current_location_lat, current_location_lng, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 수정 오류', error: err.message });
    }
    db.get('SELECT * FROM vehicles WHERE vehicle_id = ?', [req.params.id], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});

// 차량 삭제
app.delete('/api/vehicles/:id', (req, res) => {
  db.run('DELETE FROM vehicles WHERE vehicle_id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 삭제 오류', error: err.message });
    }
    res.json({ success: true, message: '차량 삭제 완료' });
  });
});

// ===== drivers DB 연동 API =====
app.get('/api/drivers', (req, res) => {
  db.all('SELECT * FROM drivers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});
app.post('/api/drivers', (req, res) => {
  const { company_id, name, phone, status } = req.body;
  const sql = `INSERT INTO drivers (company_id, name, phone, status) VALUES (?, ?, ?, ?)`;
  const params = [company_id, name, phone, status];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 등록 오류', error: err.message });
    }
    db.get('SELECT * FROM drivers WHERE driver_id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});
app.put('/api/drivers/:id', (req, res) => {
  const { company_id, name, phone, status } = req.body;
  const sql = `UPDATE drivers SET company_id=?, name=?, phone=?, status=? WHERE driver_id=?`;
  const params = [company_id, name, phone, status, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 수정 오류', error: err.message });
    }
    db.get('SELECT * FROM drivers WHERE driver_id = ?', [req.params.id], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});
app.delete('/api/drivers/:id', (req, res) => {
  db.run('DELETE FROM drivers WHERE driver_id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 삭제 오류', error: err.message });
    }
    res.json({ success: true, message: '운전자 삭제 완료' });
  });
});

// ===== emptyRuns 샘플 데이터 및 API =====
let emptyRuns = [
  { id: 3001, vehicleId: 2001, driverId: 1, companyId: 1001, startLocation: '서울', endLocation: '부산', startDate: '2024-01-15', startTime: '09:00', estimatedArrivalTime: '18:00', capacity: 3000, status: '예정' },
  { id: 3002, vehicleId: 2002, driverId: 2, companyId: 1002, startLocation: '대구', endLocation: '인천', startDate: '2024-01-16', startTime: '10:00', estimatedArrivalTime: '19:00', capacity: 2500, status: '진행중' },
  { id: 3003, vehicleId: 2003, driverId: 3, companyId: 1003, startLocation: '광주', endLocation: '대전', startDate: '2024-01-17', startTime: '08:00', estimatedArrivalTime: '17:00', capacity: 4000, status: '완료' }
];

// ===== shippers 샘플 데이터 및 API =====
let shippers = [
  { id: 4001, name: '삼성전자', contact: '02-2255-0114', address: '경기 수원시', etc: '대기업' },
  { id: 4002, name: '현대자동차', contact: '02-3464-1114', address: '서울 강남구', etc: '자동차' },
  { id: 4003, name: 'CJ대한통운', contact: '02-1234-5678', address: '서울 중구', etc: '물류' }
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

// ===== users DB 연동 API =====
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});
app.post('/api/users', (req, res) => {
  const { company_id, username, password_hash, full_name, email, phone, role, status } = req.body;
  const sql = `INSERT INTO users (company_id, username, password_hash, full_name, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [company_id, username, password_hash, full_name, email, phone, role, status];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 등록 오류', error: err.message });
    }
    db.get('SELECT * FROM users WHERE user_id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});
app.put('/api/users/:id', (req, res) => {
  const { company_id, username, password_hash, full_name, email, phone, role, status, last_login } = req.body;
  const sql = `UPDATE users SET company_id=?, username=?, password_hash=?, full_name=?, email=?, phone=?, role=?, status=?, last_login=?, updated_at=CURRENT_TIMESTAMP WHERE user_id=?`;
  const params = [company_id, username, password_hash, full_name, email, phone, role, status, last_login, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 수정 오류', error: err.message });
    }
    db.get('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err2, row) => {
      if (err2) {
        return res.status(500).json({ success: false, message: 'DB 조회 오류', error: err2.message });
      }
      res.json({ success: true, data: row });
    });
  });
});
app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE user_id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB 삭제 오류', error: err.message });
    }
    res.json({ success: true, message: '사용자 삭제 완료' });
  });
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

// ===== emptyRuns 샘플 데이터 및 API =====
app.get('/api/emptyruns', (req, res) => {
  res.json({ success: true, data: emptyRuns });
});
app.post('/api/emptyruns', (req, res) => {
  const { vehicleId, driverId, companyId, startLocation, endLocation, startDate, startTime, estimatedArrivalTime, capacity, status } = req.body;
  const newEmptyRun = {
    id: emptyRuns.length ? Math.max(...emptyRuns.map(e => e.id)) + 1 : 3001,
    vehicleId, driverId, companyId, startLocation, endLocation, startDate, startTime, estimatedArrivalTime, capacity, status
  };
  emptyRuns.push(newEmptyRun);
  res.status(201).json({ success: true, data: newEmptyRun });
});
app.put('/api/emptyruns/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = emptyRuns.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: '공차운행 없음' });
  emptyRuns[idx] = { ...emptyRuns[idx], ...req.body };
  res.json({ success: true, data: emptyRuns[idx] });
});
app.delete('/api/emptyruns/:id', (req, res) => {
  const id = Number(req.params.id);
  emptyRuns = emptyRuns.filter(e => e.id !== id);
  res.json({ success: true });
});

// ===== shippers 샘플 데이터 및 API =====
app.get('/api/shippers', (req, res) => {
  res.json({ success: true, data: shippers });
});
app.post('/api/shippers', (req, res) => {
  const { name, contact, address, etc } = req.body;
  const newShipper = {
    id: shippers.length ? Math.max(...shippers.map(s => s.id)) + 1 : 4001,
    name, contact, address, etc
  };
  shippers.push(newShipper);
  res.status(201).json({ success: true, data: newShipper });
});
app.put('/api/shippers/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = shippers.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: '화주 없음' });
  shippers[idx] = { ...shippers[idx], ...req.body };
  res.json({ success: true, data: shippers[idx] });
});
app.delete('/api/shippers/:id', (req, res) => {
  const id = Number(req.params.id);
  shippers = shippers.filter(s => s.id !== id);
  res.json({ success: true });
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