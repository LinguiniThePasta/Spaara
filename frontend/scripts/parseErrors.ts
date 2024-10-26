const parseErrors = (json) => {
    let string = "";

    for (const [key, value] of Object.entries(json)) {
        string += `${value.join(", ")}\n`;
      }

    return string;
}

export default parseErrors;