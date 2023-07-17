import {
  BIGGER,
  BIGGER_OR_EQUAL,
  EQUAL,
  LESS,
  LESS_OR_EQUAL,
  NOT_EQUAL,
} from "../constants";
import "../../components/styles/inputs.css";

export function symbolGenerator(counter, symbol) {
  let res = "";
  let tabsCounter = counter;

  if (symbol === "]}") {
    for (let i = 0; i < counter; i++) {
      res += "\n" + symbolGenerator(tabsCounter, "\t") + symbol;
      tabsCounter -= 1;
    }
  } else {
    for (let i = 0; i < counter; i++) {
      res += symbol;
    }
  }

  return res;
}

export function isAndCondition(value) {
  return value === "and";
}

export function isOrCondition(value) {
  return value === "or";
}

function createTooltip(name) {
  const data = JSON.parse(sessionStorage.getItem("data"));
  return `<span class="tooltip inner-tooltip">${JSON.parse(data)[name]}</span>`;
}

function createItems(vars) {
  return vars.map((item) => {
    if (typeof item === "number") {
      return item;
    } else {
      return `{"var":<span class="var-name" id="var-data"><span class="tooltip inner-tooltip" id="tooltip"></span>"${item}"</span>}`;
    }
  });
}

function createResponsiveItem(obj, status, lastBrace = false) {
  const vars = [];
  if (typeof obj[1] === "object" && typeof obj[0] === "object") {
    if (obj[1].var) {
      vars.push(obj[1].var);
    } else {
      for (const innerObj of Object.values(obj[1])[0]) {
        vars.push(innerObj.var ? innerObj.var : innerObj);
      }
    }

    let data = createItems(vars);

    const braces = lastBrace ? "]}]}" : "]}]},";

    const firstVar = `{"var":<span class="var-name" id="var-data"><span class="tooltip inner-tooltip" id="tooltip"></span>${JSON.stringify(
      obj[0].var
    )}</span>}`;

    if (typeof Object.values(obj[1])[0][0] !== "object") {
      return `<span class="${status}">[${firstVar},${data.join(",")}${
        lastBrace ? "]}" : "]},"
      } </span>\n`;
    }
    data = "[" + data.join(",") + braces;

    return `<span class="${status}">[${firstVar},{${JSON.stringify(
      Object.keys(obj[1])[0]
    )}:${data}</span>\n`;
  } else if (typeof obj[0] === "object" && typeof obj[1] !== "object") {
    if (Array.isArray(Object.values(obj[0])[0])) {
      for (const innerObj of Object.values(obj[0])[0]) {
        vars.push(innerObj.var ? innerObj.var : innerObj);
      }
      let data = createItems(vars);
      const key = Object.keys(obj[0])[0];
      return `[{"${key}":<span class="${status}">[${data.join(",")}]},${
        obj[1]
      }${lastBrace ? "]}" : "]},"}</span>\n`;
    }
  }
  return `<span class="${status}">[{"var":"<span class="var-name">${
    obj[0].var
  }</span>"},${JSON.stringify(obj[1])}${
    lastBrace ? "]}" : "]},"
  }${createTooltip(obj[0].var)}</span>\n`;
}

export function goThroughInterface(
  interfaceData,
  result,
  nesting,
  validatedData
) {
  const stack = [];

  for (let i = 0; i < interfaceData.length; i++) {
    for (const [k, objItem] of Object.entries(interfaceData[i])) {
      if (objItem.length === 0) {
        continue;
      }

      if (isAndCondition(k)) {
        result += symbolGenerator(nesting, "\t") + '{"and": [\n';
        stack.push("]}");
        [result, nesting] = goThroughInterface(
          objItem,
          result,
          nesting + 1,
          validatedData
        );
      } else if (isOrCondition(k)) {
        result += symbolGenerator(nesting, "\t") + '{"or": [\n';
        stack.push("]}");
        [result, nesting] = goThroughInterface(
          objItem,
          result,
          nesting + 1,
          validatedData
        );
      } else {
        switch (k) {
          case "==":
            result += symbolGenerator(nesting, "\t") + EQUAL;
            break;
          case "!=":
            result += symbolGenerator(nesting, "\t") + NOT_EQUAL;
            break;
          case ">=":
            result += symbolGenerator(nesting, "\t") + BIGGER_OR_EQUAL;
            break;
          case "<=":
            result += symbolGenerator(nesting, "\t") + LESS_OR_EQUAL;
            break;
          case ">":
            result += symbolGenerator(nesting, "\t") + BIGGER;
            break;
          case "<":
            result += symbolGenerator(nesting, "\t") + LESS;
            break;
          default:
            console.error("Something went wrong");
        }

        const stringifiedItem = JSON.stringify(objItem);
        const errHtml = `<div class="default">No data</div>`;

        if (i === interfaceData.length - 1) {
          if (!validatedData) {
            result += `${stringifiedItem}}\n`;
            nesting--;
            continue;
          }

          if (validatedData[objItem[0].var] === true) {
            result += createResponsiveItem(objItem, "green", true);
          } else if (!validatedData.hasOwnProperty(objItem[0].var)) {
            result += `${stringifiedItem}},${errHtml}\n`;
          } else {
            if (validatedData[objItem[0].var].length) {
              if (validatedData[objItem[0].var][0]) {
                result += createResponsiveItem(objItem, "green", true);
              } else {
                result += createResponsiveItem(objItem, "red", true);
              }
              validatedData[objItem[0].var].shift();
              nesting--;
              continue;
            }

            result += createResponsiveItem(objItem, "red", true);
          }
          nesting--;
        } else {
          if (!validatedData) {
            result += `${stringifiedItem}},\n`;
            continue;
          }

          if (!objItem[0].var && typeof objItem[0] === "object") {
            const value = Object.values(objItem[0])[0][0];
            if (validatedData[value.var] === true) {
              result += createResponsiveItem(objItem, "green");
            } else if (!validatedData.hasOwnProperty(value.var)) {
              result += `${stringifiedItem}},${errHtml}\n`;
            } else {
              if (validatedData[value.var].length) {
                if (validatedData[value.var][0]) {
                  result += createResponsiveItem(objItem, "green");
                } else {
                  result += createResponsiveItem(objItem, "red");
                }
                validatedData[value.var].shift();
              } else {
                result += createResponsiveItem(objItem, "red");
              }
            }
            continue;
          }

          if (validatedData[objItem[0].var] === true) {
            result += createResponsiveItem(objItem, "green");
          } else if (!validatedData.hasOwnProperty(objItem[0].var)) {
            result += `${stringifiedItem}},${errHtml}\n`;
          } else {
            if (validatedData[objItem[0].var].length) {
              if (validatedData[objItem[0].var][0]) {
                result += createResponsiveItem(objItem, "green");
              } else {
                result += createResponsiveItem(objItem, "red");
              }
              validatedData[objItem[0].var].shift();
              continue;
            }
            result += createResponsiveItem(objItem, "red");
          }
        }
      }
    }

    if (stack.length > 0) {
      if (i !== interfaceData.length - 1) {
        result +=
          symbolGenerator(nesting, "\t") + stack[stack.length - 1] + ",\n";
        stack.pop();
      } else {
        result +=
          symbolGenerator(nesting, "\t") + stack[stack.length - 1] + "\n";
        stack.pop();
        nesting--;
      }
    }
  }

  return [result, nesting];
}