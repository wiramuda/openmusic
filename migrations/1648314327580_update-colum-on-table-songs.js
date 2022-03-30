/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('songs', 'owner', 'album_id');

  pgm.sql("insert into album values('old_songs','old_songs',0000)");

  pgm.sql("update songs set album_id='old_songs' where album_id=NULL");

  pgm.addConstraint('songs', 'fk_songs.album_id_album.id', 'FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_album.id');
  pgm.sql("update songs set album_id='NULL' where album_id='old_songs'");
  pgm.sql("delete album where id='old-songs'");
};
