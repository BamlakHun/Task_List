// check weather the fields are empty of not 
const isNull = (value) => value === undefined || value === null || 
( typeof value === "object" && Object.keys(value).length === 0) || 
( typeof value === "string" && value.trim().length === 0);

module.exports = isNull; 