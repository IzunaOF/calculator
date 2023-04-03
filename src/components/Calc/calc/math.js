class MathOperation {
  constructor(numbers) {
    this.numbers = numbers;
    this.isolated = [];
  }
  computeLine(line = this.model(this.numbers)) {
    if (line.length <= 1) return line;
    const details = this.getOperator(line);
    const operator = details.operator;
    const i = details.index;

    this.isolated = [Number(line[i - 1]), Number(line[i + 1])];

    if (isNaN(this.isolated[0]) || isNaN(this.isolated[1])) return line;
    line[i - 1] = this.calculate(operator);
    line.splice(i, 2);

    return this.computeLine(line);
  }

  getOperator(line = this.model(this.numbers)) {
    const details = (op, i) => {
      return { operator: op, index: i };
    };

    if (line.includes("/")) return details("/", line.indexOf("/"));
    else if (line.includes("*")) return details("*", line.indexOf("*"));
    else {
      for (let i = 1; i < line.length; i + 2) {
        if (isNaN(line[i])) return details(line[i], i);
        else return details(line[i], i);
      }
    }
  }
  calculate(type = this.getOperator(this.numbers)) {
    const n = this.isolated;
    switch (type) {
      case "+":
        return n[0] + n[1];
      case "-":
        return n[0] - n[1];
      case "*":
        return n[0] * n[1];
      case "/":
        return n[0] / n[1];
      case "%":
        return n[0] % n[1];
      default:
        return 0;
    }
  }
  innerBracketRegex() {
    // eslint-disable-next-line
    const calcLine = new String(this.numbers);
    // eslint-disable-next-line
    const rx = new RegExp(/\([\-]{0,1}\d+[.\d]*[\/\*\+\-][\-]{0,1}\d+[.\d]*([\-]*\d*[.\d]*[\/\*\+\-][\-]{0,1}\d+[.\d]*)*\)/);
    const b = rx.test(calcLine);
    const v = rx.exec(calcLine);
    return { ok: b, value: v === null ? null : v[0], where: b ? v.index : null };
  }

  innerCalc() {
    const string = this.numbers;
    const regex = this.innerBracketRegex();
    if (regex.ok) {
      const start = regex.where;
      const end = regex.value.length + start;
      const isolated = string.slice(start, end);
      const calcIsolated = this.computeLine(this.model(isolated.slice(1, isolated.length - 1)));
      const splitted = string.split(isolated);
      const response = splitted.join(calcIsolated);
      this.numbers = response;
      return this.innerCalc();
    } else {
      return this.computeLine(this.model(string));
    }
  }
  model(line = this.numbers) {
    const symbolsIndex = [];
    const nums = [];
    const symbols = [];
    const formattedCalc = [];

    for (let i = 0; i < line.length; i++) {
      const op = isNaN(line[i]) && line[i] !== ".";
      const negative = !isNaN(line[i + 1]) && line[i] === "-" && isNaN(line[i - 1]);
      if (op && !negative) {
        symbols.push(line[i]);
        symbolsIndex.push(i);
      }
    }

    for (let i = 0, s = 0, numbers = ""; i < line.length; i++) {
      if (i !== symbolsIndex[s]) numbers += line[i];
      else {
        if (numbers !== "") {
          nums.push(numbers);
        }
        s++;
        numbers = "";
      }
      if (i + 1 === line.length) {
        nums.push(numbers);
      }
    }

    for (let op = 0, n = 0; op <= symbols.length; ) {
      if (symbols[op] === "(") {
        formattedCalc.push(symbols[op]);
        op++;
      } else if (symbols[op - 1] === ")") {
        formattedCalc.push(symbols[op]);
        op++;
      } else {
        formattedCalc.push(nums[n], symbols[op]);
        op++;
        n++;
      }
    }
    if (formattedCalc.includes(undefined)) {
      formattedCalc.splice(formattedCalc.indexOf(undefined), 1);
    }
    return formattedCalc;
  }
}

const Calculus = MathOperation;
export default Calculus;
