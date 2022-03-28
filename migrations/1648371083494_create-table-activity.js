/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('activity', {
        id: {
            type:'VARCHAR(50)',
            primaryKey: true
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        action: {
            type: 'TEXT',
            notNull: true,
        },
        time: {
            type: 'TEXT',
            notNull: true,
        }
    });

    pgm.addConstraint('activity', 'fk_activity.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE')
};

exports.down = pgm => {
    pgm.dropTable('activity');

    pgm.dropConstraint('activity', 'fk_activity.playlist_id_playlist.id');
};
