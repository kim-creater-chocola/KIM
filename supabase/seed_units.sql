-- 仮免14単元のマスタ投入
-- schema.sql 実行後に、SQL Editor で実行してください。

insert into units (key, exam_type, order_no, name) values
  ('kari-01', 'kari', 1, '運転者の心得'),
  ('kari-02', 'kari', 2, '信号に従うこと'),
  ('kari-03', 'kari', 3, '標識・標示などに従うこと'),
  ('kari-04', 'kari', 4, '車が通行するところ、車が通行してはいけないところ'),
  ('kari-05', 'kari', 5, '緊急自動車などの優先'),
  ('kari-06', 'kari', 6, '交差点などの通行、踏切'),
  ('kari-07', 'kari', 7, '安全な速度と車間距離'),
  ('kari-08', 'kari', 8, '歩行者の保護など'),
  ('kari-09', 'kari', 9, '安全の確認と合図、警音器の使用'),
  ('kari-10', 'kari', 10, '進路変更など'),
  ('kari-11', 'kari', 11, '追い越し'),
  ('kari-12', 'kari', 12, '行き違い'),
  ('kari-13', 'kari', 13, '運転免許制度、交通反則通告制度'),
  ('kari-14', 'kari', 14, 'AT自動車などの運転')
on conflict (key) do update set
  exam_type = excluded.exam_type,
  order_no = excluded.order_no,
  name = excluded.name;
