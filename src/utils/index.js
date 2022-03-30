/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  update_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: update_at,
});
const mapResponse = ({
  id, title, performer,
}) => ({
  id, title, performer,
});

const activityMap = ({
  username, title, action, time,
}) => ({
  username, title, action, time,
});

module.exports = { mapDBToModel, mapResponse, activityMap };
