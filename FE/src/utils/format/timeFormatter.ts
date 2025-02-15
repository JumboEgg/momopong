function TempTimeFormatter(time: number) {
    if (time > 60) {
        if (time % 60 === 0) return `${time / 60}시간`;
        return `${Math.floor(time / 60)}시간 ${time % 60}분`;
    }
    return `${time}분`;
}

export default TempTimeFormatter;
