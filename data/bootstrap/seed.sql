delete from users;

insert into users (id, user_name, created, updated) values (1, 'testuser1', unixepoch(), unixepoch());
insert into users (id, user_name, created, updated) values (2, 'testuser2', unixepoch(), unixepoch());
insert into users (id, user_name, created, updated) values (3, 'testuser3', unixepoch(), unixepoch());
insert into users (id, user_name, created, updated) values (4, 'testuser4', unixepoch(), unixepoch());
insert into users (id, user_name, created, updated) values (5, 'testuser5', unixepoch(), unixepoch());

delete from urls;

insert into urls (id, user_id, url, slug, created, updated) values (1, 1, 'http://www.example1.com', 'test1', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (2, 1, 'http://www.example2.com', 'test2', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (3, 1, 'http://www.example3.com', 'test3', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (4, 1, 'http://www.example4.com', 'test4', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (5, 1, 'http://www.example5.com', 'test5', unixepoch(), unixepoch());

insert into urls (id, user_id, url, slug, created, updated) values (6, 2, 'http://www.example1.com', 'test6', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (7, 2, 'http://www.example2.com', 'test7', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (8, 2, 'http://www.example3.com', 'test8', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (9, 2, 'http://www.example4.com', 'test9', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (10, 2, 'http://www.example5.com', 'test10', unixepoch(), unixepoch());

insert into urls (id, user_id, url, slug, created, updated) values (11, 3, 'http://www.example1.com', 'test11', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (12, 3, 'http://www.example2.com', 'test12', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (13, 3, 'http://www.example3.com', 'test13', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (14, 3, 'http://www.example4.com', 'test14', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (15, 3, 'http://www.example5.com', 'test15', unixepoch(), unixepoch());

insert into urls (id, user_id, url, slug, created, updated) values (16, 4, 'http://www.example1.com', 'test16', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (17, 4, 'http://www.example2.com', 'test17', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (18, 4, 'http://www.example3.com', 'test18', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (19, 4, 'http://www.example4.com', 'test19', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (20, 4, 'http://www.example5.com', 'test20', unixepoch(), unixepoch());

insert into urls (id, user_id, url, slug, created, updated) values (21, 5, 'http://www.example1.com', 'test21', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (22, 5, 'http://www.example2.com', 'test22', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (23, 5, 'http://www.example3.com', 'test23', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (24, 5, 'http://www.example4.com', 'test24', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (25, 5, 'http://www.example5.com', 'test25', unixepoch(), unixepoch());

delete from metrics;

insert into metrics (id, url_id, ip_address, created, updated) values (1, 1, '192.168.0.1', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (2, 1, '1.1.1.1', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (3, 2, '192.168.0.2', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (4, 2, '1.1.1.2', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (5, 3, '192.168.0.3', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (6, 3, '1.1.1.3', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (7, 4, '192.168.0.4', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (8, 4, '1.1.1.4', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (9, 5, '192.168.0.5', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (10, 5, '1.1.1.5', unixepoch(), unixepoch());

insert into metrics (id, url_id, ip_address, created, updated) values (11, 6, '192.168.0.6', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (12, 6, '1.1.1.6', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (13, 7, '192.168.0.7', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (14, 7, '1.1.1.7', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (15, 8, '192.168.0.8', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (16, 8, '1.1.1.8', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (17, 9, '192.168.0.9', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (18, 9, '1.1.1.9', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (19, 10, '192.168.0.10', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (20, 10, '1.1.1.10', unixepoch(), unixepoch());

insert into metrics (id, url_id, ip_address, created, updated) values (21, 11, '192.168.0.11', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (22, 11, '1.1.1.11', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (23, 12, '192.168.0.12', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (24, 12, '1.1.1.12', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (25, 13, '192.168.0.13', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (26, 13, '1.1.1.13', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (27, 14, '192.168.0.14', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (28, 14, '1.1.1.14', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (29, 15, '192.168.0.15', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (30, 15, '1.1.1.15', unixepoch(), unixepoch());

insert into metrics (id, url_id, ip_address, created, updated) values (31, 16, '192.168.0.16', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (32, 16, '1.1.1.16', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (33, 17, '192.168.0.17', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (34, 17, '1.1.1.17', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (35, 18, '192.168.0.18', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (36, 18, '1.1.1.18', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (37, 19, '192.168.0.19', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (38, 19, '1.1.1.19', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (39, 20, '192.168.0.20', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (40, 20, '1.1.1.20', unixepoch(), unixepoch());

insert into metrics (id, url_id, ip_address, created, updated) values (41, 21, '192.168.0.21', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (42, 21, '1.1.1.21', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (43, 22, '192.168.0.22', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (44, 22, '1.1.1.22', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (45, 23, '192.168.0.23', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (46, 23, '1.1.1.23', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (47, 24, '192.168.0.24', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (48, 24, '1.1.1.24', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (49, 25, '192.168.0.25', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, created, updated) values (50, 25, '1.1.1.25', unixepoch(), unixepoch());
