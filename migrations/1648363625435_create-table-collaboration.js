/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('collaboration', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
    pgm.addConstraint('collaboration', 'fk_collaboration.playlit_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE')

    pgm.addConstraint('collaboration', 'fk_collaboration.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE')

};

exports.down = pgm => {
    pgm.dropTable('collaborations');
    pgm.dropConstraint('collaborations', 'fk_collaboration.playlit_id_playlist.id');
    pgm.dropConstraint('collaborations', 'fk_collaboration.user_id_users.id');

};
