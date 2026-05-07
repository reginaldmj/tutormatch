-- TutorMatch seed data
-- Run this after schema.sql during development.

delete from tutor_availability;
delete from tutors;

insert into tutors (
  name,
  subject,
  price,
  rating,
  bio,
  avatar_url
)
values
(
  'John Doe',
  'Algebra & SAT Math',
  35,
  4.9,
  'Experienced math tutor focused on building strong fundamentals.',
  'https://api.dicebear.com/7.x/initials/png?seed=John%20Doe'
),
(
  'Jane Smith',
  'Python & Computer Science',
  45,
  4.8,
  'I teach coding, problem solving, and computer science concepts.',
  'https://api.dicebear.com/7.x/initials/png?seed=Jane%20Smith'
),
(
  'Bob Johnson',
  'English & Essay Writing',
  30,
  4.7,
  'Helping students improve writing clarity and structure.',
  'https://api.dicebear.com/7.x/initials/png?seed=Bob%20Johnson'
);

insert into tutor_availability (
  tutor_id,
  date,
  time,
  is_available
)
select id, '2026-05-12', '9:00 AM', true
from tutors;

insert into tutor_availability (
  tutor_id,
  date,
  time,
  is_available
)
select id, '2026-05-12', '11:00 AM', true
from tutors;

insert into tutor_availability (
  tutor_id,
  date,
  time,
  is_available
)
select id, '2026-05-13', '2:00 PM', true
from tutors;

select * from tutors;
select * from tutor_availability;