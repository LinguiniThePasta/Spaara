const shortenTime = (timeString) => {
    // time string is in form of 2024-10-25T05:14:52.410337Z
    const string = timeString.substring(0, 10);
    return string;
}

export default shortenTime;