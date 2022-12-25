module.exports = {
    paginate: (array, page_number, page_size) => {
        const start = (page_number - 1) * page_size;
        const end = page_number * page_size < array.length ? page_number * page_size : array.length;
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice(start, end);
    }
}