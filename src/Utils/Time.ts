export default {
  getHours(totalSeconds: number): number {
    return Math.floor(totalSeconds / 3600);
  },
  getMinutes(totalSeconds: number): number {
    return Math.floor(totalSeconds / 60) % 60;
  },
  getSeconds(totalSeconds: number): number {
    return totalSeconds % 60;
  },
  format(totalSeconds: number): string {
    const [h, m, s] = [
      this.getHours(totalSeconds),
      this.getMinutes(totalSeconds),
      this.getSeconds(totalSeconds)
    ].map(num => num.toString());
    let result = `${h}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
    if (h === "0") {
      result = result.slice(2);
    }
    return result;
  }
};
