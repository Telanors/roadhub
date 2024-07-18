const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
};

const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, "0")}${(
        (hash >> 16) &
        0xff
    )
        .toString(16)
        .padStart(2, "0")}${((hash >> 8) & 0xff)
        .toString(16)
        .padStart(2, "0")}`;
    return color;
};

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 15)];
    }
    return color;
}

function truncateString(str, maxLength, end) {
    return str.length > maxLength ? str.slice(0, maxLength) + end : str;
}

export { arraysAreEqual, stringToColor, getRandomColor, truncateString };
