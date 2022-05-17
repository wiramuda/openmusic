const mapTo = (payload) => ({
  id: payload[0].id,
  name: payload[0].name,
  year: payload[0].year,
  coverUrl: payload[0].cover,
  songs: payload.map((item) => ({
    id: item.song_id,
    title: item.title,
  })),
});

module.exports = mapTo;
