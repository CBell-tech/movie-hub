(() => {
    const search = document.getElementById('movie-search');
    const genreFilter = document.getElementById('genre-filter');
    const sort = document.getElementById('movie-sort');
    const cards = Array.from(document.querySelectorAll('.movie-card')).map((card, index) => {
        if (card.closest('.flex4allrol2, .flex4allrol3')) card.classList.add('portrait-card');
        const text = selector => card.querySelector(selector).textContent.trim();
        return {
            card, index,
            year: Number(text('.date')),
            rating: Number(text('.ratingBG h2:last-child')),
            genres: text('.genree').split(',').map(genre => genre.trim()),
            searchable: ['.txt', '.genree', '.date', '.about', '.ratingBG'].map(text).join(' ').toLowerCase(),
            fields: ['.txt', '.genree', '.date', '.about'].map(selector => {
                const container = card.querySelector(selector);
                const element = container.querySelector('p') || container;
                return {element, original: element.textContent};
            })
        };
    });

    [...new Set(cards.flatMap(item => item.genres))].sort().forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.append(option);
    });

    function highlight({element, original}, keyword) {
        element.replaceChildren();
        let position = 0;
        let match;
        while (keyword && (match = original.toLowerCase().indexOf(keyword, position)) !== -1) {
            element.append(document.createTextNode(original.slice(position, match)));
            const mark = document.createElement('mark');
            mark.textContent = original.slice(match, match + keyword.length);
            element.append(mark);
            position = match + keyword.length;
        }
        element.append(document.createTextNode(original.slice(position)));
    }

    function update() {
        const keyword = search.value.toLowerCase().trim();
        const ordered = [...cards].sort((a, b) => {
            if (sort.value === 'newest') return b.year - a.year || a.index - b.index;
            if (sort.value === 'oldest') return a.year - b.year || a.index - b.index;
            if (sort.value === 'rating') return b.rating - a.rating || a.index - b.index;
            return a.index - b.index;
        });
        const grid = document.querySelector('.movies-grid');
        let count = 0;
        ordered.forEach(item => {
            const matches = item.searchable.includes(keyword) && (!genreFilter.value || item.genres.includes(genreFilter.value));
            item.card.hidden = !matches;
            item.fields.forEach(field => highlight(field, keyword));
            // Move cards so keyboard and screen-reader order also follows the sort.
            grid.append(item.card);
            if (matches) count++;
        });
        document.getElementById('movie-count').textContent = `${count} of ${cards.length} titles`;
        document.getElementById('noResults').style.display = count ? 'none' : 'block';
    }

    search.addEventListener('input', update);
    genreFilter.addEventListener('change', update);
    sort.addEventListener('change', update);
    document.getElementById('reset-filters').addEventListener('click', () => {
        search.value = '';
        genreFilter.value = '';
        sort.value = 'default';
        update();
    });
    update();
})();
