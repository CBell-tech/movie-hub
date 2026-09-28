const movieId = new URLSearchParams(window.location.search).get('movie');
const movie = movies.find(item => item.id === movieId);

if (!movie) {
    document.getElementById('not-found').hidden = false;
} else {
    document.title = `${movie.title} | MoviesHub`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('year').textContent = movie.year;
    document.getElementById('genre').textContent = movie.genre;
    document.getElementById('rating').textContent = `${movie.rating} / 10`;
    document.getElementById('description').textContent = movie.description;
    const poster = document.getElementById('poster');
    poster.src = movie.image;
    poster.alt = `${movie.title} poster`;

    if (movie.downloadUrl.trim()) {
        const downloadUrl = new URL(movie.downloadUrl, window.location.href);
        if (['https:', 'http:', 'file:'].includes(downloadUrl.protocol)) {
            const link = document.getElementById('download-link');
            link.href = downloadUrl.href;
            link.hidden = false;
            document.getElementById('download-unavailable').hidden = true;
            document.getElementById('download-note').textContent = 'Your download may open on the provider’s website.';
        }
    }
    document.getElementById('movie-details').hidden = false;
}
