const parseErrors = (json) => {
    let string = "";

    for (const [key, value] of Object.entries(json)) {
        string += `${key}: ${value.join(", ")}\n`
    }

    return string;
}

export default parseErrors()