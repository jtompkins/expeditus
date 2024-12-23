drop table if exists users;

create table users (
  id integer primary key,
  user_name text,
  created numeric,
  updated numeric
);

drop table if exists urls;

create table urls (
  id integer primary key,
  user_id integer,
  url text,
  slug text unique,
  created numeric,
  updated numeric,
  foreign key (user_id) references users(id)
);

drop table if exists metrics;

create table metrics (
  id integer primary key,
  url_id integer,
  ip_address text,
  created numeric,
  updated numeric,
  foreign key (url_id) references urls(id)
)
