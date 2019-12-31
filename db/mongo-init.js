/* eslint-disable no-undef */
db.createUser({
  user: 'linku_user',
  pwd: 'root_12345',
  roles: [
    {
      role: 'readWrite',
      db: 'linku',
    },
  ],
});
