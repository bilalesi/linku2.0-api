export type Department = {
  name: String;
  code: String;
};

export type Period = {
  name: String;
  code: String;
};

export type Level = {
  name: String;
  code: 'PR' | 'PG' | 'EC' | 'EX';
};

export type Subject = {
  name: String;
  departmentName: String;
  code: String;
  number: String;
  mat: String;
};

type Time = {
  start: String;
  end: String;
};

type Schedule = {
  startDate: String;
  endDate: String;
  time: Time;
  place: String;
  day: String;
};

type Quota = {
  taken: Number;
  free: Number;
};

export type Group = {
  nrc: String;
  subject: Subject;
  professors: String[];
  schedule: Schedule[];
  quota: Quota;
};
