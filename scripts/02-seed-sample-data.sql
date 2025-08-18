-- Sample data for Labchain app testing

-- Insert sample social workers
INSERT INTO social_workers (name, email, phone, department) VALUES
('조지영', 'jjy@slab.org', '010-1234-5678', '노인복지과'),
('김민수', 'kms@slab.org', '010-2345-6789', '상담지원팀'),
('이하늘', 'lhn@slab.org', '010-3456-7890', '노인복지과');

-- Insert sample elderly clients
INSERT INTO elderly_clients (name, birth_date, phone, address, guardian_name, guardian_phone, guardian_relationship, risk_level) VALUES
('김순애', '1938-12-05', '010-7867-9856', '경기도 춘천시 석주로 **', '김영희', '010-1111-2222', '딸', 'medium'),
('이미자', '1942-03-15', '010-8765-4321', '서울시 강남구 테헤란로 123', '이철수', '010-3333-4444', '아들', 'high'),
('박철수', '1940-07-22', '010-5555-6666', '부산시 해운대구 센텀로 456', '박영미', '010-7777-8888', '딸', 'low'),
('최영희', '1945-11-30', '010-9999-0000', '대구시 중구 동성로 789', '최민호', '010-1010-2020', '아들', 'medium');

-- Insert sample appointments
INSERT INTO appointments (social_worker_id, client_id, appointment_date, status, location) VALUES
((SELECT id FROM social_workers WHERE name = '조지영'), (SELECT id FROM elderly_clients WHERE name = '김순애'), '2025-01-20 14:00:00+09', 'scheduled', '상담실 A'),
((SELECT id FROM social_workers WHERE name = '조지영'), (SELECT id FROM elderly_clients WHERE name = '이미자'), '2025-01-20 15:30:00+09', 'scheduled', '상담실 B'),
((SELECT id FROM social_workers WHERE name = '김민수'), (SELECT id FROM elderly_clients WHERE name = '박철수'), '2025-01-21 10:00:00+09', 'scheduled', '상담실 A'),
((SELECT id FROM social_workers WHERE name = '이하늘'), (SELECT id FROM elderly_clients WHERE name = '최영희'), '2025-01-21 14:00:00+09', 'scheduled', '상담실 C');

-- Insert sample completed counseling sessions
INSERT INTO counseling_sessions (appointment_id, social_worker_id, client_id, session_date, session_goals, session_notes, counselor_observations, session_summary) VALUES
((SELECT id FROM appointments WHERE appointment_date = '2025-01-20 14:00:00+09'), 
 (SELECT id FROM social_workers WHERE name = '조지영'), 
 (SELECT id FROM elderly_clients WHERE name = '김순애'), 
 '2025-01-20 14:00:00+09',
 ARRAY['정서적 지지 강화', '가족관계 속 외로움 완화', '단기 기억 저하로 인한 혼란 완화'],
 '최근 생활에서 기억 관리가 어렵다고 느낀 순간이 있으셨나요?',
 '경미한 단기 기억 저하와 정서적 어려움으로 정서적 지지와 감정 표현 유도 중심 상담이 필요함',
 '가족과의 관계에서 긍정적 순간을 일부 경험함. 단기 기억 저하 지속되나, 정서적 안정감 증가. 감정 표현 유도와 가족 연계 중심 상담이 효과적임.');

-- Insert sample emotional states
INSERT INTO emotional_states (session_id, client_id, depression_level, anxiety_level, loneliness_level, anger_level, overall_mood, additional_notes) VALUES
((SELECT id FROM counseling_sessions LIMIT 1), 
 (SELECT id FROM elderly_clients WHERE name = '김순애'), 
 4, 3, 6, 2, '우울', 
 '가족과 함께할 시간에 어떤 감정을 느끼셨나요?');
