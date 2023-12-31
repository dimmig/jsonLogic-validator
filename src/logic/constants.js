export const BIGGER = `{">":`;
export const LESS = `{"<":`;
export const BIGGER_OR_EQUAL = `{">=":`;
export const LESS_OR_EQUAL = `{"<=":`;
export const EQUAL = `{"==":`;
export const NOT_EQUAL = `{"!=":`;
export const NOT_VALID_RULE = "Not valid rule";
export const NOT_VALID_DATA = "Not valid data";
export const EXAMPLE_RULE = `{"or":[{"!=":[{"var":"IsConditionMet"},true]},{"<=":[{"var":"CurrentValue"},{"+":[{"var":"MaxValue"},{"var":"Increase"},0.75]}]},{"and":[{"==":[{"var":"HasExtraCondition"},true]},{"==":[{"var":"IsSingleUser"},true]},{"<=":[{"var":"CurrentValue"},{"+":[{"var":"MaxValue"},{"var":"Increase"},0.75,1]}]}]}]}`;
export const EXAMPLE_DATA = `{"IsConditionMet": true,"CurrentValue": 42,"MaxValue": 100,"Increase": 0.5,"HasExtraCondition": false,"IsSingleUser": true}`;

export const VALID_OPTIONS = [
  { backgroundColor: "rgba(118, 219, 145, 0)" },
  { backgroundColor: "rgba(118, 219, 145, 0.6)" },
  { backgroundColor: "rgba(118, 219, 145, 0)" },
];

export const NOT_VALID_OPTIONS = [
  { backgroundColor: "rgba(250, 105, 73, 0)" },
  { backgroundColor: "rgba(250, 105, 73, 0.6)" },
  { backgroundColor: "rgba(250, 105, 73, 0)" },
];

export const OPEN_OPTIOSN = [
  { width: 0, opacity: 0 },
  { width: "30vw", opacity: 1 },
];
export const CLOSE_OPTIONS = [
  { width: "30vw", opacity: 1 },
  { width: 0, opacity: 0 },
];
