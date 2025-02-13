function TempTimeFormatter(time: number) {
    return `${time / 60}시간 ${time % 60}분`;
}

export default TempTimeFormatter;
