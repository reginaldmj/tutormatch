-- Starter tutor availability data
-- Run this after tutors exist.

delete from tutor_availability;

insert into tutor_availability (
  tutor_id,
  date,
  time,
  is_available
)
select
  id,
  'Monday, May 12',
  '9:00 AM',
  true
from tutors;

insert into tutor_availability (
  tutor_id,
  date,
  time,
  is_available
)
select
  id,
  'Monday, May 12',
  '11:00 AM',
  true
from tutors;

insert into tutor_availability (
  tutor_id,
  date,
  time,
  is_available
)
select
  id,
  'Tuesday, May 13',
  '2:00 PM',
  true
from tutors;

select * from tutor_availability;