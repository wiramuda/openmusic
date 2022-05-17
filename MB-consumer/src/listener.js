class Listener {
  constructor(songsService, mailSender) {
    this._service = songsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { email, userId, playlistId } = JSON.parse(message.content.toString());
      const songs = await this._service.getPlaylistSongs(playlistId, userId);
      const result = await this._mailSender.sendEmail(email, JSON.stringify(songs));
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Listener;
