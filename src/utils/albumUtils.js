const mapTo = (payload) => {
    return {
        id: payload[0].album_id,
        name: payload[0].name,
        year: payload[0].year,
        songs: payload.map(item => {
            return {
                id: item.id,
                title: item.title 
            }
        })
    }
}

module.exports = mapTo;