const fs = require("fs");

function parseArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof (value) === "string") {
    return value.split("\n").map((line) => line.trim()).filter((line) => line);
  }
  throw new Error("Unsupprted array format");
}

module.exports = {
  boolean: (value) => {
    if (!value || value === "false") {
      return false;
    }
    return true;
  },
  text: (value) => {
    if (value) {
      return value.split("\n");
    }
    return undefined;
  },
  number: (value) => {
    if (!value) {
      return undefined;
    }
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`Value ${value} is not a valid number`);
    }
    return parsed;
  },
  autocomplete: (value, getVal) => {
    if (!value) {
      return undefined;
    }
    if (typeof (value) === "object") {
      return (getVal ? value.value : value.id) || value;
    }
    return value;
  },
  autocompleteOrArray: (value) => {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof (value) === "object") {
      return [value.id || value];
    }
    return [value];
  },
  tags: (value, letKeyOnly) => {
    if (!value) {
      return undefined;
    }
    if (typeof (value) === "string") {
      const obj = {};
      value.split("\n").forEach((line) => {
        const [key, ...val] = line.trim().split("=");
        if (!key || (!letKeyOnly && !val)) {
          throw new Error("bad labels/tags format");
        }
        if (val.length) {
          obj[key] = val.join("=");
        } else {
          obj[key] = "";
        }
      });
      return obj;
    }
    throw new Error(`Value ${value} is not a valid tags/labels input.`);
  },
  json: (value) => {
    if (!value) {
      return undefined;
    }
    if (typeof (value) === "object") {
      return value;
    }
    if (typeof (value) === "string") {
      const trimmedValue = value.trim();
      if (trimmedValue.startsWith("{") && trimmedValue.endsWith("}")) {
        try {
          return JSON.parse(trimmedValue);
        } catch (e) {
          throw new Error(`Invalid JSON! ${e.message}`);
        }
      } else {
        if (!fs.existsSync(trimmedValue)) {
          throw new Error(`Couldn't find file '${trimmedValue}'.`);
        }
        const fileContent = fs.readFileSync(trimmedValue, "utf8");
        try {
          const obj = JSON.parse(fileContent);
          return obj;
        } catch {
          throw new Error(`The file '${trimmedValue}' doesn't contain a valid JSON.`);
        }
      }
    }
    throw new Error(`Value ${value} is not a valid JSON input.`);
  },
  string: (value) => {
    if (!value) {
      return undefined;
    }
    if (typeof (value) === "string") {
      return value.trim();
    }
    throw new Error(`Value ${value} is not a valid string`);
  },
  array: parseArray,
};
