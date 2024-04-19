'use strict';

const startID = 8000000;
const ROW_TITLE_LEN = 10;
const VIDEO_TITLE_LEN = 10;
const VIDEO_SYNOPSIS_LEN = 160;
const LOLOMO_ID_LENGTH = 16;
const ORIGINAL_THRESHOLD = 0.10;

class DataGenerator {
    constructor() {
        this._cache = [];
        this._cursor = 0;
        this._id = 0;
        this._bodyOfText = '';
        this._initializeBodyOfText();
    }

    _initializeBodyOfText() {
        const words = ["Some", "would", "argue", "that", "just", "restarting", "the", "application", "or", "throwing", "more", "RAM", "at", "it", "is", "all", "that", "is", "needed", "and", "memory", "leaks", "arent", "fatal", "in", "Node", "However", "as", "leaks", "grow", "V8", "becomes", "increasingly", "aggressive", "about", "garbage", "collection", "This", "is", "manifested", "as", "high", "frequency", "and", "longer", "time", "spent", "in", "GC", "slowing", "your", "app", "down", "So", "in", "Node", "memory", "leaks", "hurt", "performance", "Leaks", "can", "often", "be", "masked", "assasins", "Leaky", "code", "can", "hang", "on", "to", "references", "to", "limited", "resources", "You", "may", "run", "out", "of", "file", "descriptors", "or", "you", "may", "suddenly", "be", "unable", "to", "open", "new", "database", "connections", "So", "it", "may", "look", "like", "your", "backends", "are", "failing", "the", "application", "but", "it’s", "really", "a", "container", "issue"];
        let addStr = [];
        for (let i = 0; i < 5000; ++i) {
            addStr.push(_random(words));
        }
        this._bodyOfText = addStr.join(' ');
    }

    createLolomo(rows, columns, percentSimilar) {
        const lolomoId = this._generateLolomoId();
        const lolomoRows = [];
        for (let i = 0; i < rows; ++i) {
            lolomoRows.push(this._createRow(columns, percentSimilar));
        }
        return {
            rows: lolomoRows,
            id: lolomoId
        };
    }

    _generateId() {
        return START_ID + ++this._id;
    }

    _generateLolomoId() {
        let id = '';
        for (let i = 0; i < LOLOMO_ID_LENGTH; ++i) {
            id += String.fromCharCode(40 + Math.floor(Math.random() * 52));
        }
        return id;
    }

    _getRowTitle() {
        return this._read(ROW_TITLE_LEN);
    }

    _getVideoTitle() {
        return this._read(VIDEO_TITLE_LEN);
    }

    _getVideoSynopsis() {
        return this._read(VIDEO_SYNOPSIS_LEN);
    }

    _read(length) {
        const textLength = this._bodyOfText.length;
        if (textLength < this._cursor + length) {
            this._cursor = 0;
        }
        const str = this._bodyOfText.substring(this._cursor, this._cursor + length);
        this._cursor += length;
        return str;
    }

    _getRandomOriginal() {
        return Math.random() > ORIGINAL_THRESHOLD;
    }

    _getRandomCachedVideo() {
        return _random(this._cache);
    }

    _createVideo() {
        const video = {
            id: this._generateId(),
            title: this._getVideoTitle(),
            synopsis: this._getVideoSynopsis(),
            altSynopsis: this._getVideoSynopsis(),
            original: this._getRandomOriginal(),
            count: 0
        };
        this._cache.push(video);
        return video;
    }

    _createRow(columns, percentSimilar) {
        const similarCount = Math.floor(percentSimilar * columns);
        const startOfSimilars = columns - similarCount;
        const rowTitle = this._getRowTitle();
        const videos = [];
        for (let i = 0; i < columns; ++i) {
            if (i >= startOfSimilars) {
                videos.push(this._getRandomCachedVideo());
            } else {
                videos.push(this._createVideo());
            }
        }
        return {
            title: rowTitle,
            videos: videos
        };
    }
}

function _random(list) {
    return list[Math.floor(Math.random() * list.length)];
}

module.exports = DataGenerator;
