export function decomposeCode(code, variable) {
  let decomp = [];
  let split = code.split(/(?=[\s|\.|\"|\'|\`|\||\.|\+|\-|\*|\/|\^|\&|\:|\?|\!])/g)

  let str = null;

  for (let i of split) {
    if (str) {
      if (i[0] == str) str = null;
      else {
        decomp.push(i);
        continue;
      }
    }
    else {
      if (i[0] == '"' || i[0] == "'" || i[0] == '`') {
        str = i[0];
        decomp.push(i);
        continue;
      }
    }

    if (i.endsWith(variable) && i[0] != '.') {
      decomp.push(i.replace(variable, ""));
      decomp.push(null);
      continue;
    }

    decomp.push(i);
  }

  return decomp;
}

export function recomposeCode(decomp, variable) {
  let res = '';

  for (let i of decomp) {
    if (i !== null) {
      res += i;
    }
    else
      res += variable;
  }

  return res;
}
