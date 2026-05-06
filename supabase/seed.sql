-- TutorMatch seed data
-- This file inserts starter data for development/testing.
-- Run this after schema.sql if rebuilding the project.

-- =========================
-- STARTER TUTORS
-- =========================

-- Clear existing tutor rows first.
-- This prevents duplicate starter tutors during development.
delete from tutors;

-- Insert sample tutors used by the app.
insert into tutors (
  name,
  subject,
  price,
  rating,
  bio
)
values
(
  'John Doe',
  'Algebra & SAT Math',
  35,
  4.9,
  'Experienced math tutor focused on building strong fundamentals.'
),
(
  'Jane Smith',
  'Python & Computer Science',
  45,
  4.8,
  'I teach coding, problem solving, and computer science concepts.'
),
(
  'Bob Johnson',
  'English & Essay Writing',
  30,
  4.7,
  'Helping students improve writing clarity and structure.'
);

-- Verify inserted tutors.
select * from tutors;