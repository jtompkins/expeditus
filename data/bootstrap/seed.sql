delete from users;

insert into users (id, github_username, github_email, created, updated) values (1, 'jtompkins', 'me@joshtompkins.codes', unixepoch(), unixepoch());

delete from urls;

insert into urls (id, user_id, url, slug, created, updated) values (1, 1, 'https://www.youtube.com/watch?v=XfELJU1mRMg', 'test', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (2, 1, 'http://www.example2.com', 'test2', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (3, 1, 'http://www.example3.com', 'test3', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (4, 1, 'http://www.example4.com', 'test4', unixepoch(), unixepoch());
insert into urls (id, user_id, url, slug, created, updated) values (5, 1, 'http://www.example5.com', 'test5', unixepoch(), unixepoch());

delete from metrics;

insert into metrics (id, url_id, ip_address, referrer, created, updated) values (1, 1, '192.168.0.1', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (2, 1, '1.1.1.1', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (3, 2, '192.168.0.2', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (4, 2, '1.1.1.2', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (5, 3, '192.168.0.3', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (6, 3, '1.1.1.3', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (7, 4, '192.168.0.4', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (8, 4, '1.1.1.4', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (9, 5, '192.168.0.5', 'example.com', unixepoch(), unixepoch());
insert into metrics (id, url_id, ip_address, referrer, created, updated) values (10, 5, '1.1.1.5', 'example.com', unixepoch(), unixepoch());
